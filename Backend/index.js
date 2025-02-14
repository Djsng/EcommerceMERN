const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to allow only specific frontend origin
const allowedOrigins = ['http://localhost:3000']; // Update with your frontend URL
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Salon Service Backend');
});

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoDB URI is not defined');
    process.exit(1);  // Exit if MongoDB URI is not defined
}

// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT Secret is not defined');
    process.exit(1);  // Exit if JWT Secret is not defined
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Staff Schema
const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    specialty: { type: String, required: true },
    contact: { type: String, required: true },
});

const Staff = mongoose.model('Staff', staffSchema);

// Sign-Up Route
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Sign-In Route
app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        // Compare the provided password with the stored password
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Sign In Successful', token, email: user.email });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Edit Profile Route (Check email, then update username and password)
app.post('/edit-profile', async (req, res) => {
    try {
        const { email, newUsername, newPassword } = req.body;

        // Validate input fields
        if (!newUsername || !email || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email' });
        }

        // Update user's username & password
        user.username = newUsername;
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile. Please try again.', error: error.message || error });
    }
});

// Forgot password route
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
    }

    // Respond with a success message (No reset code generated on backend now)
    res.status(200).json({ message: 'Email found, please generate reset code on the frontend' });
});

// Reset password route
app.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'No user found with this email' });
    }

    // Update password with the new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated' });
});

// GET /api/staff - Fetch staff list
app.get('/staff-management', async (req, res) => {
    try {
        const staffList = await Staff.find(); // Fetch staff list from the database
        res.status(200).json(staffList); // Send staff list as JSON response
    } catch (error) {
        console.error('Error fetching staff list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/staff - Add a new staff member
app.post('/add-staff', async (req, res) => {
    const { name, rating, specialty, contact } = req.body;

    if (!name || !rating || !specialty || !contact) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newStaff = new Staff({ name, rating, specialty, contact });
        await newStaff.save();

        res.status(201).json({ message: 'Staff added successfully.', staff: newStaff });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Report Schema (for storing queries)
const reportSchema = new mongoose.Schema({
    email: { type: String, required: true },
    query: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

// POST route for submitting a report/query
app.post('/customer-query', async (req, res) => {
    const { email, query } = req.body;
    if (!email || !query) {
        return res.status(400).json({ message: 'Email and query are required' });
    }

    try {
        const newReport = new Report({ email, query });
        await newReport.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting report', error });
    }
});

// GET route to fetch all reports
app.get('/admin-reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 }); // Get reports sorted by date (newest first)
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
});

// Product Schema
const productSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
});

const Product = mongoose.model('Product', productSchema);

// POST /add-product - Add a new product
app.post('/add-product', async (req, res) => {
    try {
        const { category, productName, price } = req.body;
        
        if (!category || !productName || price == null) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        const newProduct = new Product({ category, productName, price });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully.', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /products - Fetch all products based on search query
app.get('/products', async (req, res) => {
    try {
        const searchQuery = req.query.search;

        let products = [];
        if (searchQuery) {
            products = await Product.find({
                $or: [
                    { category: { $regex: new RegExp(searchQuery, "i") } }, // Case-insensitive match
                    { productName: { $regex: new RegExp(searchQuery, "i") } }
                ]
            }).sort({ category: 1, productName: 1 });
        } else {
            products = await Product.find().sort({ category: 1, productName: 1 });
        }

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delivery Queue Schema (for bought products)
const deliveryQueueSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['In Queue', 'Shipped', 'Delivered'], default: 'In Queue' },
    deliveryDate: { type: Date, default: Date.now },
    deliveryTimer: { type: Number, required: true } // Random delivery time between 1 and 3 days
}, {
    timestamps: true
});

// Create a model for the DeliveryQueue
const DeliveryQueue = mongoose.model('DeliveryQueue', deliveryQueueSchema);

// POST route to handle product purchase
app.post('/api/buy', async (req, res) => {
    const { email, productId } = req.body;

    if (!email || !productId) {
        return res.status(400).json({ message: 'Email and Product ID are required' });
    }

    try {
        // Find the product from the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Add the product to the delivery queue with random delivery time
        const deliveryItem = new DeliveryQueue({
            email,
            productId,
            productName: product.productName,
            price: product.price,
            deliveryTimer: Math.floor(Math.random() * 3) + 1, // Random delivery time between 1 and 3 days
        });

        await deliveryItem.save();

        res.status(200).json({ message: 'Product added to delivery queue' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product to queue' });
    }
});

// Get bought items
app.get('/api/delivery-queue', async (req, res) => {
    const email = req.query.email; // Get email from query params

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Fetch products in the delivery queue for the given email
        const deliveryItems = await DeliveryQueue.find({ email });

        if (!deliveryItems.length) {
            return res.status(404).json({ message: 'No products found in delivery queue' });
        }

        res.status(200).json(deliveryItems); // No need to modify deliveryTimer here
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching delivery queue' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});