import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  // Define inline schemas to avoid import issues
  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    phone: String,
  }, { timestamps: true });

  const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    clientName: String,
    clientPhone: String,
    services: [String],
    kg: Number,
    totalPrice: Number,
    paymentStatus: String,
    orderStatus: String,
    paymentMethod: String,
    estimatedCompletion: String,
    notes: String,
  }, { timestamps: true });

  const SettingsSchema = new mongoose.Schema({
    pricing: { cuciLipat: Number, setrika: Number, cuciSetrika: Number },
    estimatedTime: { cuciLipat: String, setrika: String, cuciSetrika: String },
    adminPhone: String,
    storeName: String,
  });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
  const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

  // Clear existing data
  await Promise.all([User.deleteMany({}), Order.deleteMany({}), Settings.deleteMany({})]);
  console.log("Cleared existing data");

  // Create admin
  const adminHash = await bcrypt.hash("admintest", 12);
  await User.create({
    name: "Admin Test",
    email: "admintest@wangsit.id",
    passwordHash: adminHash,
    role: "admin",
    phone: "6281234567890",
  });
  console.log("Created admin: admintest@wangsit.id / admintest");

  // Create sample client
  const clientHash = await bcrypt.hash("clienttest", 12);
  const client = await User.create({
    name: "Client Test",
    email: "clienttest@wangsit.id",
    passwordHash: clientHash,
    role: "client",
    phone: "6281298765432",
  });
  console.log("Created client: clienttest@wangsit.id / clienttest");

  // Create settings
  await Settings.create({
    pricing: { cuciLipat: 7000, setrika: 5000, cuciSetrika: 10000 },
    estimatedTime: { cuciLipat: "2-3 hari", setrika: "1 hari", cuciSetrika: "3-4 hari" },
    adminPhone: "6281234567890",
    storeName: "Wangsit Laundry",
  });
  console.log("Created default settings");

  // Create sample orders
  const today = new Date();
  const orders = [
    {
      orderNumber: "WNG-20240101-0001",
      clientId: client._id.toString(),
      clientName: "Budi Santoso",
      clientPhone: "6281298765432",
      services: ["cuciLipat"],
      kg: 3,
      totalPrice: 21000,
      paymentStatus: "paid",
      orderStatus: "Lunas",
      paymentMethod: "bayar_sekarang",
      estimatedCompletion: "2-3 hari",
      createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      orderNumber: "WNG-20240102-0001",
      clientName: "Sari Dewi",
      clientPhone: "6282211223344",
      services: ["cuciSetrika"],
      kg: 5,
      totalPrice: 50000,
      paymentStatus: "unpaid",
      orderStatus: "Selesai",
      paymentMethod: "bayar_nanti",
      estimatedCompletion: "3-4 hari",
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      orderNumber: "WNG-20240103-0001",
      clientName: "Ahmad Fauzi",
      clientPhone: "6285566778899",
      services: ["setrika"],
      kg: 2,
      totalPrice: 10000,
      paymentStatus: "unpaid",
      orderStatus: "Proses",
      paymentMethod: "bayar_nanti",
      estimatedCompletion: "1 hari",
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      orderNumber: "WNG-20240104-0001",
      clientName: "Rina Kusuma",
      clientPhone: "6281122334455",
      services: ["cuciLipat", "setrika"],
      kg: 4,
      totalPrice: 40000,
      paymentStatus: "pending",
      orderStatus: "Pending",
      paymentMethod: "bayar_sekarang",
      estimatedCompletion: "3-4 hari",
      createdAt: new Date(),
    },
  ];

  await Order.insertMany(orders);
  console.log(`Created ${orders.length} sample orders`);

  console.log("\n✅ Seed completed successfully!");
  console.log("Admin: admintest@wangsit.id / admintest");
  console.log("Client: clienttest@wangsit.id / clienttest");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
