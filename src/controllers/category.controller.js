const Category = require("../models/Category");
const Product = require("../models/Product");
const PAGE_SIZE = 2;

const index = async (req, res, next) => {
    const categories = await Category.find({}, { _id: 1, name: 1 });

    return res.status(200).json([...categories]);
};

const newCategory = async (req, res, next) => {
    const { name } = req.body;

    const newCategory = await Category.create({ name });

    return res.status(201).json({ success: true, data: newCategory });
};

const getProductByCategory = async (req, res, next) => {
    // const products = await Product.find({ category: req.params._id }, { description: 0, size: 0, color: 0, createdAt: 0, updatedAt: 0, __v: 0 }).populate('category', 'name')

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
            { category: req.params._id },
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
            { category: req.params._id },
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

const editCategory = async (req, res, next) => {
    const { name, _id } = req.body;

    await Category.where({ _id: _id }).update({
        name: name,
    });

    return res.status(201).json({ errCode: 0, message: "Upload successfully" });
};

const deleteCategory = async (req, res, next) => {
    const { _id } = req.query;

    await Category.deleteOne({ _id: _id });

    deleteCategory.deletedCount;
    return res.status(201).json({ errCode: 0, message: "Delete successfully" });
};

module.exports = {
    index,
    newCategory,
    getProductByCategory,
    editCategory,
    deleteCategory,
};
