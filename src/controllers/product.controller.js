const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const PAGE_SIZE = 2;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/publics/images");
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + ".png");
    },
});

const uploadImg = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            return cb(null, true);
        }

        req.fileValidationError = "Error";
        return cb(null, false, new Error("goes wrong on the mimetype"));
    },
}).single("image");

const upload = (req, res, next) => {
    uploadImg(req, res, function (err) {
        if (req.fileValidationError) {
            return res.status(400).json({
                success: false,
                message: req.fileValidationError,
            });
        }
        next();
    });
};

const getProduct = async (req, res, next) => {
    const products = await Product.find({}).populate("category", "name");

    return res.status(200).json({ errCode: 0, data: [...products] });
};

const index = async (req, res, next) => {
    // const products = await Product.find({}, { description: 0, size: 0, color: 0, createdAt: 0, updatedAt: 0, __v: 0 }).populate('category', 'name')

    // return res.status(200).json({
    //     success: true,
    //     data: products
    // })
    // setTimeout(() => {
    //     return res.status(200).json([...products])
    // }, 3000)

    const page = +req.query.page;
    if (page) {
        const countSkip = (page - 1) * PAGE_SIZE;
        const products = await Product.find(
            {},
            {
                description: 0,
                size: 0,
                color: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            }
        )
            .populate("category", "name")
            .skip(countSkip)
            .limit(PAGE_SIZE);
        setTimeout(() => {
            return res.status(200).json([...products]);
        }, 1000);
    } else {
        const products = await Product.find(
            {},
            {
                description: 0,
                size: 0,
                color: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            }
        ).populate("category", "name");
        return res.status(200).json([...products]);
    }
};

const getProductById = async (req, res, next) => {
    const { _id } = req.params;

    const product = await Product.findById(_id, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    })
        .populate("category", "name")
        .lean();

    // return res.status(200).json(product)

    if (req.user) {
        const user = await User.findOne({
            _id: req.user._id,
            favorites: product._id,
        });

        if (user) {
            return res.status(200).json({ ...product, favorite: true });
        }
    }

    return res.status(200).json({ ...product, favorite: false });
};

const newProduct = async (req, res, next) => {
    const { name, price, description, size, color, category } = req.body;
    const { filename } = req.file;

    const newProduct = await Product.create(
        new Product({
            name,
            price,
            description,
            size,
            color,
            category,
            image: filename,
        })
    );

    return res.status(201).json({ success: true, data: newProduct });
};

const editProduct = async (req, res, next) => {
    const { _id, name, price, description, size, color, category } = req.body;

    await Product.where({ _id: _id }).update({
        name,
        price,
        description,
        size,
        color,
        category,
        image: req.file?.filename,
    });

    return res.status(201).json({ errCode: 0, message: "Update successfully" });
};

const deleteProduct = async (req, res, next) => {
    const { _id } = req.body;

    await Product.deleteOne({ _id: _id });

    deleteProduct.deletedCount;
    return res.status(201).json({ errCode: 0, message: "Delete successfully" });
};

const searchProduct = async (req, res, next) => {
    const { name } = req.query;

    // const productFound = await Product.aggregate([
    //     {$match: { name: { $regex : name, $options: 'i' } }},
    //     {$project: { _id: 1, name: 1, image: 1 }}
    // ]).populate('category', 'name')

    const products = await Product.find(
        { name: { $regex: name, $options: "i" } },
        {
            description: 0,
            size: 0,
            color: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        }
    ).populate("category", "name");

    setTimeout(() => {
        return res.status(200).json([...products]);
    }, 1000);
};

const suggestProduct = async (req, res, next) => {
    const products = await Product.find(
        {},
        {
            description: 0,
            size: 0,
            color: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        }
    )
        .populate("category", "name")
        .limit(8)
        .sort({ price: -1 });

    return res.status(200).json([...products]);
};

const favoriteProduct = async (req, res, next) => {
    const { product, love } = req.query;

    await User.updateOne(
        { _id: req.user._id },
        {
            ...(love === "true"
                ? { $addToSet: { favorites: product } }
                : { $pull: { favorites: product } }),
        }
    );

    return res.status(200).json({
        success: true,
        message: "Add to favorite success!",
    });
};

const getFavorites = async (req, res, next) => {
    const products = await User.findOne({ _id: req.user._id })
        .populate({
            path: "favorites",
            model: "Product",
            select: { _id: 1, name: 1, price: 1, image: 1 },
            populate: {
                path: "category",
                model: "Category",
                select: { _id: 1, name: 1 },
            },
        })
        .lean();

    products?.favorites?.map((item) => (item.favorite = true));

    return res.status(200).json(products.favorites);
};

module.exports = {
    index,
    getProductById,
    upload,
    getProduct,
    newProduct,
    editProduct,
    deleteProduct,
    searchProduct,
    suggestProduct,
    favoriteProduct,
    getFavorites,
};
