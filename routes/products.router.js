import express from "express";
import Product from "../schemas/products.schema.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/products", async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const { title, content, author, password } = req.body;
    const newProduct = new Product({
      title,
      content,
      author,
      password,
    });
    await newProduct.save();
    res.status(201).json({ message: "판매 상품을 등록했습니다." });
  } catch (error) {
    res.status(500).json({ message: "무슨짓하신거에요." });
  }
});

// 목록
router.get("/products", async (req, res) => {
  try {
    const product = await Product.find()
      .select("_id title author status createAt")
      .sort({ createAt: -1 });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "무슨짓하신거에요." });
  }
});

// 상세 목록
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "_id title content author status createAt"
    );

    if (!product) {
      return res.status(404).json({ message: "그런거 없어요." });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "무슨짓하신거에요." });
  }
});

//수정
router.put("/products/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "그런거 없어요." });
    }
    if (password !== product.password) {
      return res.status(401).json({ message: "권한이 존재하지 않습니다." });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: "수정되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "무슨짓하신거에요." });
  }
});

//삭제
router.delete("/products/:productId", async (req, res) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const productId = req.params.productId;
    const { password } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "그런거 없어요." });
    }
    if (password !== product.password) {
      return res.status(401).json({ message: "권한이 존재하지 않습니다." });
    }

    await product.deleteOne({ id: productId });
    res.json({ massage: "삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "무슨짓하신거에요." });
  }
});

export default router;
