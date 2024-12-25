import multer from 'multer';
import { storage } from '../config/cloundinary.js';
import Product from '../models/product.js';


const upload = multer({ storage: storage });

router.post('/upload', upload.array('images'), async (req, res) => {
  const images = req.files.map(file => {
    return {
      url: file.path,
      public_id: file.filename
    };
  });

  // Lưu thông tin ảnh vào CSDL
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    salePrice: req.body.salePrice,
    images: images.map(image => image.url),
    description: req.body.description,
    sizes: req.body.sizes,
    tags: req.body.tags,
    CategoryId: req.body.CategoryId
  });

  try {
    const savedProduct = await Product.save();
    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lưu sản phẩm vào CSDL' });
  }
});