export const FLUTTER_PUBSPEC = `name: lune_luxury_app
description: Luné Luxury Fashion & Accessories Mobile App with Customer Details, Cart, Orders, Order Details, Address Book & Add Address
publish_to: 'none'
version: 1.3.0+4

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^6.2.1
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;

export const FLUTTER_MAIN_DART = `import 'dart:ui';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const LuneApp());
}

class LuneApp extends StatelessWidget {
  const LuneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luné Fashion & Accessories',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0284C7),
          primary: const Color(0xFF0284C7),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.light().textTheme,
        ),
      ),
      home: const LuneMainScreen(),
    );
  }
}

// -------------------------------------------------------------
// GLASSMORPHISM HELPER (iOS Liquid Glass Effect)
// -------------------------------------------------------------
class GlassContainer extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final double blur;
  final double opacity;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final double? width;
  final double? height;
  final BoxBorder? border;

  const GlassContainer({
    super.key,
    required this.child,
    this.borderRadius = 20,
    this.blur = 16,
    this.opacity = 0.85,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.width,
    this.height,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      margin: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(opacity),
              borderRadius: BorderRadius.circular(borderRadius),
              border: border ??
                  Border.all(
                    color: Colors.white.withOpacity(0.85),
                    width: 1.2,
                  ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0284C7).withOpacity(0.06),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// DATA MODELS: Customer, Address, Product, Cart, Order & Details
// -------------------------------------------------------------
class Customer {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String? alternatePhone;
  final String tier;
  final int loyaltyPoints;
  final String avatarInitials;

  const Customer({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.alternatePhone,
    required this.tier,
    required this.loyaltyPoints,
    required this.avatarInitials,
  });
}

enum CustomerAddressType { home, work, other }

class CustomerLocationRes {
  final int id;
  final int customerId;
  final String recipientName;
  final String countryName;
  final String stateName;
  final String districtName;
  final String pincode;
  final String addressLine1;
  final String? addressLine2;
  final String cityVillage;
  final String? landmark;
  final String mobileNumber;
  final String? alternatePhone;
  final CustomerAddressType addressType;
  final bool defaultAddress;

  const CustomerLocationRes({
    required this.id,
    required this.customerId,
    required this.recipientName,
    required this.countryName,
    required this.stateName,
    required this.districtName,
    required this.pincode,
    required this.addressLine1,
    this.addressLine2,
    required this.cityVillage,
    this.landmark,
    required this.mobileNumber,
    this.alternatePhone,
    required this.addressType,
    required this.defaultAddress,
  });

  CustomerLocationRes copyWith({bool? defaultAddress}) {
    return CustomerLocationRes(
      id: id,
      customerId: customerId,
      recipientName: recipientName,
      countryName: countryName,
      stateName: stateName,
      districtName: districtName,
      pincode: pincode,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      cityVillage: cityVillage,
      landmark: landmark,
      mobileNumber: mobileNumber,
      alternatePhone: alternatePhone,
      addressType: addressType,
      defaultAddress: defaultAddress ?? this.defaultAddress,
    );
  }

  String get formattedAddress {
    final buffer = StringBuffer(addressLine1);
    if (addressLine2 != null && addressLine2!.isNotEmpty) {
      buffer.write(', \$addressLine2');
    }
    if (landmark != null && landmark!.isNotEmpty) {
      buffer.write(' (Near \$landmark)');
    }
    buffer.write(', \$cityVillage, \$stateName - \$pincode');
    return buffer.toString();
  }
}

class ProductVariant {
  final String name;
  final String imageUrl;
  final Color? color;
  final List<String>? images;

  const ProductVariant({
    required this.name,
    required this.imageUrl,
    this.color,
    this.images,
  });
}

class Product {
  final String id;
  final String name;
  final String category;
  final String categoryLabel;
  final double price;
  final double? originalPrice;
  final double rating;
  final int reviews;
  final String imageUrl;
  final List<String>? images;
  final String? badge;
  final String description;
  final List<String> details;
  final List<String>? sizes;
  final List<ProductVariant>? colorVariants;

  const Product({
    required this.id,
    required this.name,
    required this.category,
    required this.categoryLabel,
    required this.price,
    this.originalPrice,
    required this.rating,
    required this.reviews,
    required this.imageUrl,
    this.images,
    this.badge,
    required this.description,
    this.details = const [],
    this.sizes,
    this.colorVariants,
  });

  bool get isDress => category.toLowerCase().contains('dress') || (sizes != null && sizes!.isNotEmpty);
}

class CartItem {
  final Product product;
  int quantity;
  final String? selectedSize;
  final String? selectedColor;
  final String? selectedVariantImage;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedSize,
    this.selectedColor,
    this.selectedVariantImage,
  });
}

class OrderItem {
  final String productId;
  final String name;
  final String imageUrl;
  final double price;
  final int quantity;
  final String? size;
  final String? color;
  final String? sku;

  const OrderItem({
    required this.productId,
    required this.name,
    required this.imageUrl,
    required this.price,
    required this.quantity,
    this.size,
    this.color,
    this.sku,
  });

  double get total => price * quantity;
}

enum OrderStatus {
  placed,
  confirmed,
  processing,
  shipped,
  outForDelivery,
  delivered,
  cancelled,
}

class OrderTimelineStep {
  final String title;
  final String description;
  final String timestamp;
  final bool isCompleted;
  final bool isCurrent;

  const OrderTimelineStep({
    required this.title,
    required this.description,
    required this.timestamp,
    required this.isCompleted,
    this.isCurrent = false,
  });
}

class OrderPricing {
  final double subtotal;
  final double deliveryFee;
  final double discount;
  final double tax;
  final double grandTotal;

  const OrderPricing({
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.tax,
    required this.grandTotal,
  });
}

class Order {
  final String orderId;
  final DateTime date;
  final OrderStatus status;
  final Customer customer;
  final CustomerLocationRes shippingAddress;
  final List<OrderItem> items;
  final OrderPricing pricing;
  final String paymentMethod;
  final String paymentStatus;
  final String transactionId;
  final String courierPartner;
  final String trackingNumber;
  final String estimatedDelivery;
  final List<OrderTimelineStep> timeline;

  const Order({
    required this.orderId,
    required this.date,
    required this.status,
    required this.customer,
    required this.shippingAddress,
    required this.items,
    required this.pricing,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.transactionId,
    required this.courierPartner,
    required this.trackingNumber,
    required this.estimatedDelivery,
    required this.timeline,
  });
}

// -------------------------------------------------------------
// RICH DUMMY DATA FOR CUSTOMER, ADDRESSES, ORDERS & PRODUCTS
// -------------------------------------------------------------
const Customer dummyCustomer = Customer(
  id: 1,
  name: 'Elena Vance',
  email: 'elena.vance@lifestyle.com',
  phone: '+91 98450 12345',
  alternatePhone: '+91 80 4123 9876',
  tier: 'Gold VIP Member',
  loyaltyPoints: 1450,
  avatarInitials: 'EV',
);

final List<Product> sampleProducts = [
  // Dress 1: Aurelia Silk Satin Slip Dress
  const Product(
    id: 'prod-dress-1',
    name: 'Aurelia Silk Satin Slip Dress',
    category: 'dresses',
    categoryLabel: 'Dresses',
    price: 129.00,
    originalPrice: 165.00,
    badge: 'Best Seller',
    rating: 5.0,
    reviews: 142,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Liquid drape bias-cut slip dress tailored from lustrous 19-momme silk charmeuse with adjustable delicate rouleau straps.',
    details: [
      '100% Grade 6A Pure Mulberry Silk Charmeuse',
      'True bias cut for effortless feminine draping',
      'Adjustable delicate spaghetti straps',
      'French seam finishing with side leg slit',
    ],
    colorVariants: [
      ProductVariant(
        name: 'Champagne Gold',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
        color: Color(0xFFD4AF37),
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        ],
      ),
      ProductVariant(
        name: 'Emerald Forest',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        color: Color(0xFF064E3B),
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80',
        ],
      ),
      ProductVariant(
        name: 'Noir Velvet',
        imageUrl: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
        color: Color(0xFF0F172A),
        images: [
          'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        ],
      ),
    ],
  ),

  // Dress 2: Seraphina Tiered Linen Midi Dress
  const Product(
    id: 'prod-dress-2',
    name: 'Seraphina Tiered Linen Midi Dress',
    category: 'dresses',
    categoryLabel: 'Dresses',
    price: 89.00,
    badge: 'New Arrival',
    rating: 4.9,
    reviews: 89,
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Breezy architectural summer midi crafted from washed French flax linen with smocked bodice and cascading tiered skirt.',
    details: [
      '100% Certified French Flax Linen',
      'Smocked bodice with comfortable elasticity',
      'Deep functional hidden side pockets',
    ],
    colorVariants: [
      ProductVariant(
        name: 'Oat Milk Cream',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
        color: Color(0xFFF5EBE0),
      ),
      ProductVariant(
        name: 'Sunbaked Terracotta',
        imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
        color: Color(0xFF9C4221),
      ),
    ],
  ),

  // Prod 3: Everyday Handbag
  const Product(
    id: 'prod-3',
    name: 'Everyday Handbag',
    category: 'bags',
    categoryLabel: 'Bags',
    price: 79.99,
    originalPrice: 99.99,
    badge: '-20%',
    rating: 5.0,
    reviews: 94,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    description: 'Structured silhouette crafted from supple grained vegan leather with gleaming gold hardware and versatile double carrying handles.',
    colorVariants: [
      ProductVariant(
        name: 'Cerulean Teal Pebble',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        color: Color(0xFF0891B2),
      ),
      ProductVariant(
        name: 'Obsidian Noir Leather',
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
        color: Color(0xFF0F172A),
      ),
    ],
  ),

  // Prod 4: Classic Frame Sunglasses
  const Product(
    id: 'prod-4',
    name: 'Classic Frame Sunglasses',
    category: 'sunglasses',
    categoryLabel: 'Sunglasses',
    price: 29.99,
    badge: 'Trending',
    rating: 5.0,
    reviews: 128,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic oversized ivory frames with polarized UV400 gradient lenses. Effortlessly elevate any casual or formal ensemble.',
  ),

  // Prod 5: Silk Scrunchie Set
  const Product(
    id: 'prod-1',
    name: 'Silk Scrunchie Set',
    category: 'hair',
    categoryLabel: 'Hair Accessories',
    price: 14.99,
    originalPrice: 19.99,
    badge: 'Popular',
    rating: 4.9,
    reviews: 73,
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    description: 'Set of three 100% pure 22-momme Mulberry silk scrunchies that prevent hair breakage and creasing.',
    colorVariants: [
      ProductVariant(
        name: 'Blush Rose Silk',
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
        color: Color(0xFFFDA4AF),
      ),
    ],
  ),

  // Prod 6: Chunky Twisted Gold Hoops
  const Product(
    id: 'prod-5',
    name: 'Chunky Twisted Gold Hoops',
    category: 'jewellery',
    categoryLabel: 'Jewellery',
    price: 34.50,
    rating: 4.9,
    reviews: 88,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    description: 'Sculptural twisted hoop earrings dipped in 18k gold vermeil. Feather-light for all-day comfort without pulling the earlobe.',
  ),
];

// Saved Customer Addresses
final List<CustomerLocationRes> initialAddresses = [
  const CustomerLocationRes(
    id: 101,
    customerId: 1,
    recipientName: 'Elena Vance',
    countryName: 'India',
    stateName: 'Karnataka',
    districtName: 'Bengaluru Urban',
    pincode: '560001',
    addressLine1: 'Villa 42, Palm Meadows Luxury Enclave',
    addressLine2: 'Phase 2, Varthur Main Road',
    cityVillage: 'Bengaluru',
    landmark: 'Behind Forum Value Mall',
    mobileNumber: '+91 98450 12345',
    alternatePhone: '+91 80 4123 9876',
    addressType: CustomerAddressType.home,
    defaultAddress: true,
  ),
  const CustomerLocationRes(
    id: 102,
    customerId: 1,
    recipientName: 'Elena Vance (Office)',
    countryName: 'India',
    stateName: 'Karnataka',
    districtName: 'Bengaluru Urban',
    pincode: '560103',
    addressLine1: 'Tower B, 7th Floor, Ecospace Tech Park',
    addressLine2: 'Outer Ring Road, Bellandur',
    cityVillage: 'Bengaluru',
    landmark: 'Opposite Central Mall',
    mobileNumber: '+91 98450 12345',
    alternatePhone: '+91 80 6789 0123',
    addressType: CustomerAddressType.work,
    defaultAddress: false,
  ),
  const CustomerLocationRes(
    id: 103,
    customerId: 1,
    recipientName: 'Elena Vance (Creative Studio)',
    countryName: 'India',
    stateName: 'Karnataka',
    districtName: 'Bengaluru Urban',
    pincode: '560038',
    addressLine1: 'Studio 14, 100ft Road Indiranagar',
    addressLine2: 'Above Third Wave Coffee',
    cityVillage: 'Bengaluru',
    landmark: 'Near Indiranagar Metro Pillar 84',
    mobileNumber: '+91 98450 99887',
    addressType: CustomerAddressType.other,
    defaultAddress: false,
  ),
  const CustomerLocationRes(
    id: 104,
    customerId: 1,
    recipientName: 'Elena Vance (Penthouse)',
    countryName: 'India',
    stateName: 'Karnataka',
    districtName: 'Bengaluru Urban',
    pincode: '560042',
    addressLine1: 'Flat 402, Prestige Hermitage',
    addressLine2: 'Kensington Road, Ulsoor',
    cityVillage: 'Bengaluru',
    landmark: 'Near Ulsoor Lake Promenade',
    mobileNumber: '+91 98450 12345',
    addressType: CustomerAddressType.home,
    defaultAddress: false,
  ),
];

// Realistic Dummy Orders with Customer Details, Timeline, Tracking & Breakdown
final List<Order> initialOrders = [
  Order(
    orderId: 'LNE-84920',
    date: DateTime.now().subtract(const Duration(days: 1, hours: 4)),
    status: OrderStatus.shipped,
    customer: dummyCustomer,
    shippingAddress: initialAddresses[0],
    pricing: const OrderPricing(
      subtotal: 143.99,
      deliveryFee: 0.00,
      discount: 0.00,
      tax: 7.20,
      grandTotal: 151.19,
    ),
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Paid',
    transactionId: 'UPI-TXN-98421049281',
    courierPartner: 'Delhivery Express Surface',
    trackingNumber: 'TRK-992144810',
    estimatedDelivery: 'Tomorrow, by 7:00 PM',
    items: [
      OrderItem(
        productId: 'prod-dress-1',
        name: 'Aurelia Silk Satin Slip Dress',
        imageUrl: sampleProducts[0].imageUrl,
        price: 129.00,
        quantity: 1,
        size: 'M',
        color: 'Champagne Gold',
        sku: 'LNE-DRS-01-GLD-M',
      ),
      OrderItem(
        productId: 'prod-1',
        name: 'Silk Scrunchie Set',
        imageUrl: sampleProducts[4].imageUrl,
        price: 14.99,
        quantity: 1,
        color: 'Blush Rose Silk',
        sku: 'LNE-SCR-01-ROS',
      ),
    ],
    timeline: [
      const OrderTimelineStep(
        title: 'Order Placed & Verified',
        description: 'Payment authorized via UPI. Digital order invoice generated.',
        timestamp: 'Yesterday, 10:30 AM',
        isCompleted: true,
      ),
      const OrderTimelineStep(
        title: 'Order Confirmed at Luné Atelier',
        description: 'Items tailored and inspected by atelier quality department.',
        timestamp: 'Yesterday, 2:15 PM',
        isCompleted: true,
      ),
      const OrderTimelineStep(
        title: 'Dispatched via Delhivery Express',
        description: 'Package picked up from Bengaluru Fulfillment Center.',
        timestamp: 'Today, 8:40 AM',
        isCompleted: true,
        isCurrent: true,
      ),
      const OrderTimelineStep(
        title: 'Out for Delivery',
        description: 'Delhivery delivery executive assigned for door delivery.',
        timestamp: 'Expected Tomorrow, 10:00 AM',
        isCompleted: false,
      ),
      const OrderTimelineStep(
        title: 'Delivered',
        description: 'Package delivered to Villa 42, Palm Meadows Enclave.',
        timestamp: 'Expected Tomorrow, by 7:00 PM',
        isCompleted: false,
      ),
    ],
  ),

  Order(
    orderId: 'LNE-73219',
    date: DateTime.now().subtract(const Duration(days: 6)),
    status: OrderStatus.delivered,
    customer: dummyCustomer,
    shippingAddress: initialAddresses[1],
    pricing: const OrderPricing(
      subtotal: 89.00,
      deliveryFee: 0.00,
      discount: 10.00,
      tax: 4.45,
      grandTotal: 83.45,
    ),
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    paymentStatus: 'Paid',
    transactionId: 'STRIPE-CH-3048921',
    courierPartner: 'Delhivery Air Prime',
    trackingNumber: 'TRK-881023741',
    estimatedDelivery: 'Delivered on 5 Oct 2026',
    items: [
      OrderItem(
        productId: 'prod-dress-2',
        name: 'Seraphina Tiered Linen Midi Dress',
        imageUrl: sampleProducts[1].imageUrl,
        price: 89.00,
        quantity: 1,
        size: 'S',
        color: 'Oat Milk Cream',
        sku: 'LNE-DRS-02-CRM-S',
      ),
    ],
    timeline: [
      const OrderTimelineStep(
        title: 'Order Placed',
        description: 'Payment completed via Visa Credit Card.',
        timestamp: '6 days ago, 3:10 PM',
        isCompleted: true,
      ),
      const OrderTimelineStep(
        title: 'Dispatched via Delhivery',
        description: 'In transit from Mumbai Hub.',
        timestamp: '5 days ago, 11:00 AM',
        isCompleted: true,
      ),
      const OrderTimelineStep(
        title: 'Delivered with Signature',
        description: 'Handed over at Tower B, Ecospace Tech Park.',
        timestamp: '4 days ago, 4:25 PM',
        isCompleted: true,
        isCurrent: true,
      ),
    ],
  ),

  Order(
    orderId: 'LNE-61902',
    date: DateTime.now().subtract(const Duration(days: 12)),
    status: OrderStatus.delivered,
    customer: dummyCustomer,
    shippingAddress: initialAddresses[0],
    pricing: const OrderPricing(
      subtotal: 109.98,
      deliveryFee: 0.00,
      discount: 0.00,
      tax: 5.50,
      grandTotal: 115.48,
    ),
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    transactionId: 'APAY-TXN-11928472',
    courierPartner: 'Delhivery Express',
    trackingNumber: 'TRK-771920394',
    estimatedDelivery: 'Delivered on 29 Sep 2026',
    items: [
      OrderItem(
        productId: 'prod-3',
        name: 'Everyday Handbag',
        imageUrl: sampleProducts[2].imageUrl,
        price: 79.99,
        quantity: 1,
        color: 'Cerulean Teal Pebble',
        sku: 'LNE-BAG-03-TEL',
      ),
      OrderItem(
        productId: 'prod-4',
        name: 'Classic Frame Sunglasses',
        imageUrl: sampleProducts[3].imageUrl,
        price: 29.99,
        quantity: 1,
        sku: 'LNE-SNG-04-IVR',
      ),
    ],
    timeline: [
      const OrderTimelineStep(
        title: 'Delivered',
        description: 'Delivered to resident at Palm Meadows.',
        timestamp: '12 days ago, 1:45 PM',
        isCompleted: true,
        isCurrent: true,
      ),
    ],
  ),

  Order(
    orderId: 'LNE-95412',
    date: DateTime.now().subtract(const Duration(hours: 3)),
    status: OrderStatus.processing,
    customer: dummyCustomer,
    shippingAddress: initialAddresses[3],
    pricing: const OrderPricing(
      subtotal: 219.50,
      deliveryFee: 0.00,
      discount: 15.00,
      tax: 10.98,
      grandTotal: 215.48,
    ),
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Pending Delivery',
    transactionId: 'COD-PAYABLE-AT-DOOR',
    courierPartner: 'Delhivery Logistics',
    trackingNumber: 'TRK-665192840',
    estimatedDelivery: 'Thursday, by 6:00 PM',
    items: [
      OrderItem(
        productId: 'prod-dress-1',
        name: 'Aurelia Silk Satin Slip Dress',
        imageUrl: sampleProducts[0].imageUrl,
        price: 129.00,
        quantity: 1,
        size: 'L',
        color: 'Emerald Forest',
        sku: 'LNE-DRS-01-EMR-L',
      ),
      OrderItem(
        productId: 'prod-5',
        name: 'Chunky Twisted Gold Hoops',
        imageUrl: sampleProducts[5].imageUrl,
        price: 34.50,
        quantity: 1,
        sku: 'LNE-JWL-05-GLD',
      ),
    ],
    timeline: [
      const OrderTimelineStep(
        title: 'Order Placed (Cash on Delivery)',
        description: 'Customer contact verified via OTP phone confirmation.',
        timestamp: '3 hours ago, 11:20 AM',
        isCompleted: true,
      ),
      const OrderTimelineStep(
        title: 'Processing at Atelier',
        description: 'Luxury packaging and dispatch scheduling underway.',
        timestamp: 'Just now',
        isCompleted: true,
        isCurrent: true,
      ),
      const OrderTimelineStep(
        title: 'Dispatched via Delhivery',
        description: 'Tracking number generated: TRK-665192840',
        timestamp: 'Scheduled Today, 4:00 PM',
        isCompleted: false,
      ),
    ],
  ),
];

// -------------------------------------------------------------
// MAIN SHELL SCREEN (WITH FROSTED GLASS TAB BAR)
// -------------------------------------------------------------
class LuneMainScreen extends StatefulWidget {
  const LuneMainScreen({super.key});

  @override
  State<LuneMainScreen> createState() => _LuneMainScreenState();
}

class _LuneMainScreenState extends State<LuneMainScreen> {
  int _currentTab = 0;
  final Set<String> _wishlistIds = {'prod-dress-1', 'prod-3', 'prod-4'};
  final List<CartItem> _cart = [];
  List<CustomerLocationRes> _addresses = List.from(initialAddresses);
  CustomerLocationRes? _selectedAddress;
  List<Order> _orders = List.from(initialOrders);
  final Customer _customer = dummyCustomer;

  @override
  void initState() {
    super.initState();
    _selectedAddress = _addresses.firstWhere((a) => a.defaultAddress, orElse: () => _addresses.first);

    // Initial dummy cart items pre-loaded
    _cart.add(CartItem(
      product: sampleProducts[0],
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Champagne Gold',
      selectedVariantImage: sampleProducts[0].colorVariants?[0].imageUrl,
    ));
    _cart.add(CartItem(
      product: sampleProducts[4],
      quantity: 1,
      selectedColor: 'Blush Rose Silk',
      selectedVariantImage: sampleProducts[4].colorVariants?[0].imageUrl,
    ));
  }

  void _toggleWishlist(String id) {
    setState(() {
      if (_wishlistIds.contains(id)) {
        _wishlistIds.remove(id);
      } else {
        _wishlistIds.add(id);
      }
    });
  }

  void _addToCart(Product product, {String? size, String? color, String? variantImage}) {
    setState(() {
      final index = _cart.indexWhere((item) =>
          item.product.id == product.id &&
          item.selectedSize == size &&
          item.selectedColor == color);

      if (index >= 0) {
        _cart[index].quantity += 1;
      } else {
        _cart.add(CartItem(
          product: product,
          quantity: 1,
          selectedSize: size ?? (product.isDress ? 'S' : null),
          selectedColor: color ?? (product.colorVariants?.isNotEmpty == true ? product.colorVariants![0].name : null),
          selectedVariantImage: variantImage ?? product.imageUrl,
        ));
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF0F172A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Row(
          children: [
            const Icon(CupertinoIcons.check_mark_circled_solid, color: Color(0xFF38BDF8), size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Added "\${product.name}"\${size != null ? ' (Size: \$size)' : ''} to bag',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openProductDetail(Product product) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ProductDetailSheet(
        product: product,
        isWishlisted: _wishlistIds.contains(product.id),
        onToggleWishlist: () => _toggleWishlist(product.id),
        onAddToCart: (prod, size, color, img) => _addToCart(prod, size: size, color: color, variantImage: img),
      ),
    );
  }

  void _openAddressBook() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddressBookSheet(
        addresses: _addresses,
        selectedAddress: _selectedAddress,
        onSelectAddress: (addr) {
          setState(() => _selectedAddress = addr);
          Navigator.pop(ctx);
        },
        onSetDefaultAddress: (id) {
          setState(() {
            _addresses = _addresses.map((a) => a.copyWith(defaultAddress: a.id == id)).toList();
            _selectedAddress = _addresses.firstWhere((a) => a.id == id);
          });
        },
        onOpenAddAddress: () {
          Navigator.pop(ctx);
          _openAddAddressSheet();
        },
      ),
    );
  }

  void _openAddAddressSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => AddAddressSheet(
        customerId: _customer.id,
        onSave: (newAddr) {
          setState(() {
            if (newAddr.defaultAddress) {
              _addresses = _addresses.map((a) => a.copyWith(defaultAddress: false)).toList();
            }
            _addresses.insert(0, newAddr);
            _selectedAddress = newAddr;
          });
          Navigator.pop(ctx);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              backgroundColor: const Color(0xFF0F172A),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              content: Text(
                'Added address for \${newAddr.recipientName} (\${newAddr.cityVillage})',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          );
        },
      ),
    );
  }

  void _openOrders() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => OrdersSheet(
        orders: _orders,
        onViewOrderDetails: (order) {
          Navigator.pop(ctx);
          _openOrderDetails(order);
        },
      ),
    );
  }

  void _openOrderDetails(Order order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => OrderDetailSheet(order: order),
    );
  }

  void _openStyleAdvisor() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StyleAdvisorSheet(
        products: sampleProducts,
        onAddToCart: (p) => _addToCart(p),
        onOpenProduct: (p) => _openProductDetail(p),
      ),
    );
  }

  void _openCheckout() {
    if (_cart.isEmpty) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CheckoutSheet(
        cart: _cart,
        customer: _customer,
        selectedAddress: _selectedAddress ?? _addresses.first,
        addresses: _addresses,
        onChangeAddress: () {
          Navigator.pop(ctx);
          _openAddressBook();
        },
        onOrderPlaced: (newOrder) {
          setState(() {
            _orders.insert(0, newOrder);
            _cart.clear();
          });
        },
      ),
    );
  }

  int get _cartCount => _cart.fold(0, (sum, item) => sum + item.quantity);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _currentTab,
        children: [
          HomeTab(
            onToggleWishlist: _toggleWishlist,
            isWishlisted: (id) => _wishlistIds.contains(id),
            onOpenProduct: _openProductDetail,
            onOpenShop: () => setState(() => _currentTab = 1),
            selectedAddress: _selectedAddress,
            onOpenAddressBook: _openAddressBook,
            onOpenStyleAdvisor: _openStyleAdvisor,
          ),
          ShopTab(
            onToggleWishlist: _toggleWishlist,
            isWishlisted: (id) => _wishlistIds.contains(id),
            onOpenProduct: _openProductDetail,
          ),
          BagTab(
            cart: _cart,
            customer: _customer,
            selectedAddress: _selectedAddress,
            onOpenAddressBook: _openAddressBook,
            onOpenAddAddress: _openAddAddressSheet,
            onUpdateQuantity: (idx, delta) {
              setState(() {
                _cart[idx].quantity += delta;
                if (_cart[idx].quantity <= 0) {
                  _cart.removeAt(idx);
                }
              });
            },
            onClear: () => setState(() => _cart.clear()),
            onCheckout: _openCheckout,
          ),
          WishlistTab(
            wishlistIds: _wishlistIds,
            onOpenProduct: _openProductDetail,
            onRemove: _toggleWishlist,
          ),
          ProfileTab(
            customer: _customer,
            selectedAddress: _selectedAddress,
            onOpenAddressBook: _openAddressBook,
            onOpenAddAddress: _openAddAddressSheet,
            onOpenOrders: _openOrders,
            onOpenStyleAdvisor: _openStyleAdvisor,
            addressCount: _addresses.length,
            orderCount: _orders.length,
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 10.0),
          child: GlassContainer(
            height: 66,
            borderRadius: 36,
            blur: 24,
            opacity: 0.90,
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTabItem(0, CupertinoIcons.house_alt, CupertinoIcons.house_alt_fill, 'Home'),
                _buildTabItem(1, CupertinoIcons.compass, CupertinoIcons.compass_fill, 'Explore'),
                _buildTabItem(2, CupertinoIcons.bag, CupertinoIcons.bag_fill, 'Bag', badge: _cartCount),
                _buildTabItem(3, CupertinoIcons.heart, CupertinoIcons.heart_fill, 'Saved', badge: _wishlistIds.length),
                _buildTabItem(4, CupertinoIcons.person, CupertinoIcons.person_fill, 'Profile'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTabItem(int index, IconData icon, IconData activeIcon, String label, {int? badge}) {
    final bool isSelected = _currentTab == index;
    return GestureDetector(
      onTap: () => setState(() => _currentTab = index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFFE0F2FE) : Colors.transparent,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(
                  isSelected ? activeIcon : icon,
                  size: 22,
                  color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF64748B),
                ),
              ),
              if (badge != null && badge > 0)
                Positioned(
                  top: -2,
                  right: -2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0284C7),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '$badge',
                      style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 1: HOME SCREEN
// -------------------------------------------------------------
class HomeTab extends StatelessWidget {
  final Function(String) onToggleWishlist;
  final bool Function(String) isWishlisted;
  final Function(Product) onOpenProduct;
  final VoidCallback onOpenShop;
  final CustomerLocationRes? selectedAddress;
  final VoidCallback onOpenAddressBook;
  final VoidCallback onOpenStyleAdvisor;

  const HomeTab({
    super.key,
    required this.onToggleWishlist,
    required this.isWishlisted,
    required this.onOpenProduct,
    required this.onOpenShop,
    this.selectedAddress,
    required this.onOpenAddressBook,
    required this.onOpenStyleAdvisor,
  });

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          pinned: true,
          elevation: 0,
          backgroundColor: Colors.transparent,
          flexibleSpace: ClipRect(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
              child: Container(color: Colors.white.withOpacity(0.85)),
            ),
          ),
          title: Row(
            children: [
              Text(
                'Luné',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFE0F2FE),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'ATELIER',
                  style: TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: Color(0xFF0284C7)),
                ),
              ),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(CupertinoIcons.sparkles, color: Color(0xFF0284C7), size: 20),
              onPressed: onOpenStyleAdvisor,
              tooltip: 'Style Match Quiz',
            ),
            IconButton(
              icon: const Icon(CupertinoIcons.search, color: Color(0xFF1E293B), size: 20),
              onPressed: onOpenShop,
            ),
            const SizedBox(width: 8),
          ],
        ),

        // Delivery Destination Bar
        SliverToBoxAdapter(
          child: GestureDetector(
            onTap: onOpenAddressBook,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(CupertinoIcons.location_solid, size: 14, color: Color(0xFF0284C7)),
                  const SizedBox(width: 6),
                  const Text('Deliver to: ', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  Expanded(
                    child: Text(
                      selectedAddress != null
                          ? '\${selectedAddress!.cityVillage} (\${selectedAddress!.pincode}) - \${selectedAddress!.recipientName}'
                          : 'Select address',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Icon(CupertinoIcons.chevron_down, size: 12, color: Color(0xFF94A3B8)),
                ],
              ),
            ),
          ),
        ),

        // Hero Banner
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            height: 180,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: const DecorationImage(
                image: NetworkImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: LinearGradient(
                  colors: [Colors.black.withOpacity(0.75), Colors.transparent],
                  begin: Alignment.bottomLeft,
                  end: Alignment.topRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Text(
                    'NEW ATELIER CAPSULE',
                    style: TextStyle(color: Color(0xFF38BDF8), fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Silk Dresses & Accents',
                    style: GoogleFonts.cormorantGaramond(fontSize: 22, color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: onOpenShop,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF0F172A),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Explore Now', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Products Section Title
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(18, 8, 18, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Featured Essentials', style: GoogleFonts.cormorantGaramond(fontSize: 20, fontWeight: FontWeight.bold)),
                GestureDetector(
                  onTap: onOpenShop,
                  child: const Text('View All', style: TextStyle(fontSize: 11, color: Color(0xFF0284C7), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ),

        // Product Grid
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 90),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.65,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, idx) {
                final p = sampleProducts[idx];
                return GestureDetector(
                  onTap: () => onOpenProduct(p),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              ClipRRect(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                                child: Image.network(p.imageUrl, fit: BoxFit.cover),
                              ),
                              if (p.badge != null)
                                Positioned(
                                  top: 8,
                                  left: 8,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2.5),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF0F172A).withOpacity(0.85),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(p.badge!, style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              Positioned(
                                top: 6,
                                right: 6,
                                child: GestureDetector(
                                  onTap: () => onToggleWishlist(p.id),
                                  child: CircleAvatar(
                                    radius: 14,
                                    backgroundColor: Colors.white.withOpacity(0.9),
                                    child: Icon(
                                      isWishlisted(p.id) ? CupertinoIcons.heart_fill : CupertinoIcons.heart,
                                      size: 14,
                                      color: isWishlisted(p.id) ? Colors.redAccent : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.categoryLabel.toUpperCase(), style: const TextStyle(fontSize: 8, color: Color(0xFF94A3B8), fontWeight: FontWeight.w800)),
                              const SizedBox(height: 2),
                              Text(p.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('\\$\${p.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0284C7))),
                                  Row(
                                    children: [
                                      const Icon(Icons.star, size: 12, color: Colors.amber),
                                      Text(' \${p.rating}', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
              childCount: sampleProducts.length,
            ),
          ),
        ),
      ],
    );
  }
}

// -------------------------------------------------------------
// TAB 2: EXPLORE / SHOP SCREEN
// -------------------------------------------------------------
class ShopTab extends StatefulWidget {
  final Function(String) onToggleWishlist;
  final bool Function(String) isWishlisted;
  final Function(Product) onOpenProduct;

  const ShopTab({
    super.key,
    required this.onToggleWishlist,
    required this.isWishlisted,
    required this.onOpenProduct,
  });

  @override
  State<ShopTab> createState() => _ShopTabState();
}

class _ShopTabState extends State<ShopTab> {
  String _selectedCategory = 'all';
  String _searchQuery = '';

  final List<Map<String, String>> _categories = [
    {'id': 'all', 'name': 'All Pieces'},
    {'id': 'dresses', 'name': 'Dresses & Gowns'},
    {'id': 'bags', 'name': 'Bags'},
    {'id': 'jewellery', 'name': 'Jewellery'},
    {'id': 'hair', 'name': 'Hair'},
    {'id': 'sunglasses', 'name': 'Sunglasses'},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = sampleProducts.where((p) {
      final matchesCat = _selectedCategory == 'all' || p.category == _selectedCategory;
      final matchesQuery = _searchQuery.isEmpty ||
          p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.category.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    }).toList();

    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: TextField(
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: const InputDecoration(
                  icon: Icon(CupertinoIcons.search, size: 18, color: Color(0xFF64748B)),
                  hintText: 'Search silk dresses, teal bags, accessories...',
                  hintStyle: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          SizedBox(
            height: 42,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: _categories.length,
              itemBuilder: (context, idx) {
                final cat = _categories[idx];
                final isSelected = _selectedCategory == cat['id'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = cat['id']!),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF0F172A) : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0)),
                    ),
                    child: Center(
                      child: Text(
                        cat['name']!,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                          color: isSelected ? Colors.white : const Color(0xFF475569),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 90),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.65,
              ),
              itemCount: filtered.length,
              itemBuilder: (context, idx) {
                final p = filtered[idx];
                return GestureDetector(
                  onTap: () => widget.onOpenProduct(p),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFF1F5F9)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: ClipRRect(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                            child: Image.network(p.imageUrl, fit: BoxFit.cover, width: double.infinity),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 2),
                              Text('\\$\${p.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// PRODUCT DETAIL SHEET
// -------------------------------------------------------------
class ProductDetailSheet extends StatefulWidget {
  final Product product;
  final bool isWishlisted;
  final VoidCallback onToggleWishlist;
  final Function(Product, String?, String?, String?) onAddToCart;

  const ProductDetailSheet({
    super.key,
    required this.product,
    required this.isWishlisted,
    required this.onToggleWishlist,
    required this.onAddToCart,
  });

  @override
  State<ProductDetailSheet> createState() => _ProductDetailSheetState();
}

class _ProductDetailSheetState extends State<ProductDetailSheet> {
  late String _activeImage;
  String? _selectedSize;
  String? _selectedColorName;

  @override
  void initState() {
    super.initState();
    _activeImage = widget.product.imageUrl;
    if (widget.product.sizes != null && widget.product.sizes!.isNotEmpty) {
      _selectedSize = widget.product.sizes![0];
    }
    if (widget.product.colorVariants != null && widget.product.colorVariants!.isNotEmpty) {
      _selectedColorName = widget.product.colorVariants![0].name;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 14),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.network(_activeImage, width: double.infinity, fit: BoxFit.cover),
            ),
          ),
          const SizedBox(height: 12),
          Text(widget.product.name, style: GoogleFonts.cormorantGaramond(fontSize: 22, fontWeight: FontWeight.bold)),
          Text('\\$\${widget.product.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
          const SizedBox(height: 8),
          if (widget.product.sizes != null) ...[
            const Text('Select Size', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Row(
              children: widget.product.sizes!.map((s) {
                final isSelected = _selectedSize == s;
                return GestureDetector(
                  onTap: () => setState(() => _selectedSize = s),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(s, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : const Color(0xFF1E293B))),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 14),
          ],
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              onPressed: () {
                widget.onAddToCart(widget.product, _selectedSize, _selectedColorName, _activeImage);
                Navigator.pop(context);
              },
              child: Text(
                'Add to Bag\${_selectedSize != null ? ' (\$_selectedSize)' : ''}',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 3: BAG / CART SCREEN (WITH CUSTOMER DETAILS & ADDRESS)
// -------------------------------------------------------------
class BagTab extends StatelessWidget {
  final List<CartItem> cart;
  final Customer customer;
  final CustomerLocationRes? selectedAddress;
  final VoidCallback onOpenAddressBook;
  final VoidCallback onOpenAddAddress;
  final Function(int, int) onUpdateQuantity;
  final VoidCallback onClear;
  final VoidCallback onCheckout;

  const BagTab({
    super.key,
    required this.cart,
    required this.customer,
    this.selectedAddress,
    required this.onOpenAddressBook,
    required this.onOpenAddAddress,
    required this.onUpdateQuantity,
    required this.onClear,
    required this.onCheckout,
  });

  @override
  Widget build(BuildContext context) {
    final subtotal = cart.fold(0.0, (sum, i) => sum + (i.product.price * i.quantity));
    final delivery = subtotal > 100 ? 0.0 : 12.00;
    final tax = subtotal * 0.05;
    final total = subtotal + delivery + tax;

    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Shopping Bag', style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.bold)),
                    Text('\${cart.fold(0, (sum, i) => sum + i.quantity)} items in cart', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  ],
                ),
                if (cart.isNotEmpty)
                  TextButton(
                    onPressed: onClear,
                    child: const Text('Clear', style: TextStyle(color: Colors.redAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
          ),

          if (cart.isEmpty)
            const Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(CupertinoIcons.bag, size: 48, color: Color(0xFFCBD5E1)),
                    SizedBox(height: 10),
                    Text('Your shopping bag is empty', style: TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            )
          else ...[
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 16),
                children: [
                  // 1. CUSTOMER DETAILS CARD IN CART
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F9FF),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFBAE6FD)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: const Color(0xFF0284C7),
                          child: Text(customer.avatarInitials, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(customer.name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                                    decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(6)),
                                    child: Text(customer.tier, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: Color(0xFF0284C7))),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text('\${customer.email} • \${customer.phone}', style: const TextStyle(fontSize: 10, color: Color(0xFF475569))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 2. DELIVERY ADDRESS CARD IN CART (WITH CHANGE & ADD ADDRESS)
                  Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Icon(CupertinoIcons.location_solid, size: 16, color: Color(0xFF0284C7)),
                                const SizedBox(width: 6),
                                const Text('Shipping Destination', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                if (selectedAddress?.defaultAddress == true) ...[
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                    decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                                    child: const Text('DEFAULT', style: TextStyle(fontSize: 7.5, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                                  ),
                                ],
                              ],
                            ),
                            Row(
                              children: [
                                GestureDetector(
                                  onTap: onOpenAddressBook,
                                  child: const Text('Change', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
                                ),
                                const SizedBox(width: 10),
                                GestureDetector(
                                  onTap: onOpenAddAddress,
                                  child: const Text('+ Add', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        if (selectedAddress != null) ...[
                          Text(
                            '\${selectedAddress!.recipientName} (\${selectedAddress!.addressType.name.toUpperCase()})',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            selectedAddress!.formattedAddress,
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), height: 1.3),
                          ),
                          const SizedBox(height: 3),
                          Text('Phone: \${selectedAddress!.mobileNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                        ] else ...[
                          const Text('No address selected', style: TextStyle(fontSize: 11, color: Colors.redAccent)),
                        ],
                      ],
                    ),
                  ),

                  // 3. CART ITEMS LIST
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 4),
                    child: Text('Order Items', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
                  ),
                  ...cart.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final item = entry.value;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(
                              item.selectedVariantImage ?? item.product.imageUrl,
                              width: 64,
                              height: 64,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.product.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12), maxLines: 1),
                                if (item.selectedSize != null || item.selectedColor != null)
                                  Text(
                                    '\${item.selectedColor ?? ''}\${item.selectedSize != null ? ' • Size: \${item.selectedSize}' : ''}',
                                    style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                  ),
                                const SizedBox(height: 4),
                                Text('\\$\${item.product.price.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF0284C7))),
                              ],
                            ),
                          ),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(CupertinoIcons.minus_circle, size: 20, color: Color(0xFF64748B)),
                                onPressed: () => onUpdateQuantity(idx, -1),
                              ),
                              Text('\${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              IconButton(
                                icon: const Icon(CupertinoIcons.plus_circle, size: 20, color: Color(0xFF0284C7)),
                                onPressed: () => onUpdateQuantity(idx, 1),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),

            // Order Bill Breakdown & Checkout CTA
            Container(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 92),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Items Subtotal', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('\\$\${subtotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Delhivery Express Shipping', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text(delivery == 0 ? 'FREE' : '\\$\${delivery.toStringAsFixed(2)}', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: delivery == 0 ? Colors.green : Colors.black)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('GST / Taxes (5%)', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('\\$\${tax.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const Divider(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Amount', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      Text('\\$\${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0284C7))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0284C7),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      ),
                      onPressed: onCheckout,
                      child: const Text('Proceed to Checkout', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// CHECKOUT SHEET: REVIEW CUSTOMER, ADDRESS & PAYMENT
// -------------------------------------------------------------
class CheckoutSheet extends StatefulWidget {
  final List<CartItem> cart;
  final Customer customer;
  final CustomerLocationRes selectedAddress;
  final List<CustomerLocationRes> addresses;
  final VoidCallback onChangeAddress;
  final Function(Order) onOrderPlaced;

  const CheckoutSheet({
    super.key,
    required this.cart,
    required this.customer,
    required this.selectedAddress,
    required this.addresses,
    required this.onChangeAddress,
    required this.onOrderPlaced,
  });

  @override
  State<CheckoutSheet> createState() => _CheckoutSheetState();
}

class _CheckoutSheetState extends State<CheckoutSheet> {
  late CustomerLocationRes _deliveryAddress;
  String _paymentMethod = 'UPI (Google Pay / PhonePe)';
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _deliveryAddress = widget.selectedAddress;
  }

  void _placeOrder() {
    setState(() => _isProcessing = true);
    Future.delayed(const Duration(milliseconds: 1400), () {
      final subtotal = widget.cart.fold(0.0, (sum, i) => sum + (i.product.price * i.quantity));
      final deliveryFee = subtotal > 100 ? 0.0 : 12.00;
      final tax = subtotal * 0.05;
      final total = subtotal + deliveryFee + tax;
      final orderId = 'LNE-\${(10000 + DateTime.now().millisecond * 17).toString()}';

      final newOrder = Order(
        orderId: orderId,
        date: DateTime.now(),
        status: OrderStatus.processing,
        customer: widget.customer,
        shippingAddress: _deliveryAddress,
        pricing: OrderPricing(
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: 0.0,
          tax: tax,
          grandTotal: total,
        ),
        paymentMethod: _paymentMethod,
        paymentStatus: _paymentMethod.contains('Cash') ? 'Pending' : 'Paid',
        transactionId: 'TXN-\${DateTime.now().millisecondsSinceEpoch}',
        courierPartner: 'Delhivery Express',
        trackingNumber: 'TRK-\${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
        estimatedDelivery: 'In 2-3 Business Days',
        items: widget.cart.map((c) => OrderItem(
          productId: c.product.id,
          name: c.product.name,
          imageUrl: c.selectedVariantImage ?? c.product.imageUrl,
          price: c.product.price,
          quantity: c.quantity,
          size: c.selectedSize,
          color: c.selectedColor,
          sku: 'SKU-\${c.product.id.toUpperCase()}',
        )).toList(),
        timeline: [
          OrderTimelineStep(
            title: 'Order Placed Successfully',
            description: 'Order confirmed with \$_paymentMethod.',
            timestamp: 'Just now',
            isCompleted: true,
            isCurrent: true,
          ),
          const OrderTimelineStep(
            title: 'Packing at Luné Atelier',
            description: 'Item being carefully packed with luxury gift wrap.',
            timestamp: 'Estimated Today',
            isCompleted: false,
          ),
          const OrderTimelineStep(
            title: 'Delhivery Pickup & Transit',
            description: 'Courier partner scheduled for priority shipping.',
            timestamp: 'Estimated Tomorrow',
            isCompleted: false,
          ),
        ],
      );

      widget.onOrderPlaced(newOrder);
      Navigator.pop(context);

      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('🎉 Order Confirmed!'),
          content: Text('Order #\$orderId placed successfully for \${widget.customer.name}.\n\nDelivery to: \${_deliveryAddress.cityVillage} (\${_deliveryAddress.pincode}) via Delhivery Express.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Continue Shopping', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 14),
          Text('Checkout', style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),

          // Customer details chip
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(CupertinoIcons.person_crop_circle, color: Color(0xFF0284C7), size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Ordering as \${widget.customer.name} (\${widget.customer.phone})',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Delivery Address Selector
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Delivery Address', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              GestureDetector(
                onTap: widget.onChangeAddress,
                child: const Text('Change Address', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const Icon(CupertinoIcons.location_solid, color: Color(0xFF0284C7)),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('\${_deliveryAddress.recipientName} - \${_deliveryAddress.cityVillage} (\${_deliveryAddress.pincode})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                      Text(_deliveryAddress.addressLine1, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Payment Methods
          const Text('Payment Method', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          _buildPaymentOption('UPI (Google Pay / PhonePe)', CupertinoIcons.device_phone_portrait),
          _buildPaymentOption('Credit / Debit Card', CupertinoIcons.creditcard),
          _buildPaymentOption('Cash on Delivery (COD)', CupertinoIcons.money_dollar),

          const Spacer(),

          // Confirm CTA
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              onPressed: _isProcessing ? null : _placeOrder,
              child: _isProcessing
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Confirm & Place Order', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption(String name, IconData icon) {
    final isSelected = _paymentMethod == name;
    return GestureDetector(
      onTap: () => setState(() => _paymentMethod = name),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE0F2FE) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? const Color(0xFF0284C7) : const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF64748B), size: 18),
            const SizedBox(width: 10),
            Expanded(child: Text(name, style: TextStyle(fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500))),
            if (isSelected) const Icon(CupertinoIcons.checkmark_circle_fill, color: Color(0xFF0284C7), size: 16),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// ORDERS LIST SHEET: WITH CUSTOMER & ADDRESS PREVIEW
// -------------------------------------------------------------
class OrdersSheet extends StatelessWidget {
  final List<Order> orders;
  final Function(Order) onViewOrderDetails;

  const OrdersSheet({
    super.key,
    required this.orders,
    required this.onViewOrderDetails,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 16),
          Text('My Orders & Tracking', style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              itemCount: orders.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, idx) {
                final o = orders[idx];
                return GestureDetector(
                  onTap: () => onViewOrderDetails(o),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 6, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Order #\${o.orderId}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: o.status == OrderStatus.delivered
                                    ? const Color(0xFFDCFCE7)
                                    : const Color(0xFFE0F2FE),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                o.status.name.toUpperCase(),
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                  color: o.status == OrderStatus.delivered ? const Color(0xFF166534) : const Color(0xFF0284C7),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        // Customer & Address preview in Order Card
                        Row(
                          children: [
                            const Icon(CupertinoIcons.person, size: 12, color: Color(0xFF64748B)),
                            const SizedBox(width: 4),
                            Text(o.customer.name, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                            const SizedBox(width: 10),
                            const Icon(CupertinoIcons.location, size: 12, color: Color(0xFF64748B)),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                '\${o.shippingAddress.cityVillage} (\${o.shippingAddress.pincode})',
                                style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text('Courier: \${o.courierPartner} • Tracking: \${o.trackingNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF0284C7))),
                        const Divider(height: 16),
                        // Item thumbnails
                        ...o.items.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(6),
                                child: Image.network(item.imageUrl, width: 34, height: 34, fit: BoxFit.cover),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('\${item.quantity}x \${item.name}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                                    if (item.size != null || item.color != null)
                                      Text(
                                        '\${item.color ?? ''}\${item.size != null ? ' • Size: \${item.size}' : ''}',
                                        style: const TextStyle(fontSize: 9.5, color: Color(0xFF94A3B8)),
                                      ),
                                  ],
                                ),
                              ),
                              Text('\\$\${(item.price * item.quantity).toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        )),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(o.paymentMethod, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                            Row(
                              children: [
                                Text('Total: \\$\${o.pricing.grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0284C7))),
                                const SizedBox(width: 6),
                                const Icon(CupertinoIcons.chevron_right, size: 12, color: Color(0xFF0284C7)),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// COMPREHENSIVE ORDER DETAILS SHEET: TIMELINE, CUSTOMER, ADDRESS, BILL
// -------------------------------------------------------------
class OrderDetailSheet extends StatelessWidget {
  final Order order;

  const OrderDetailSheet({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.92,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 14),

          // Header: Order ID & Status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Order #\${order.orderId}', style: GoogleFonts.cormorantGaramond(fontSize: 24, fontWeight: FontWeight.bold)),
                  Text(
                    'Placed on \${order.date.day}/\${order.date.month}/\${order.date.year}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: order.status == OrderStatus.delivered
                      ? const Color(0xFFDCFCE7)
                      : const Color(0xFFE0F2FE),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  order.status.name.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: order.status == OrderStatus.delivered ? const Color(0xFF166534) : const Color(0xFF0284C7),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          Expanded(
            child: ListView(
              children: [
                // 1. LIVE TRACKING TIMELINE
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Live Shipment Tracking', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          Text(order.courierPartner, style: const TextStyle(fontSize: 10, color: Color(0xFF0284C7), fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('AWB Tracking #: \${order.trackingNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                      Text('Estimated Delivery: \${order.estimatedDelivery}', style: const TextStyle(fontSize: 10, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                      const Divider(height: 16),
                      ...order.timeline.map((step) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              step.isCompleted ? CupertinoIcons.checkmark_circle_fill : CupertinoIcons.circle,
                              size: 16,
                              color: step.isCompleted ? const Color(0xFF0284C7) : const Color(0xFFCBD5E1),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(step.title, style: TextStyle(fontSize: 11, fontWeight: step.isCurrent ? FontWeight.bold : FontWeight.w600, color: step.isCurrent ? const Color(0xFF0284C7) : const Color(0xFF1E293B))),
                                  Text(step.description, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                                  Text(step.timestamp, style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8))),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // 2. CUSTOMER DETAILS CARD
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(CupertinoIcons.person_solid, size: 14, color: Color(0xFF0284C7)),
                          SizedBox(width: 6),
                          Text('Customer Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(order.customer.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      Text('Email: \${order.customer.email}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('Phone: \${order.customer.phone}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('Membership: \${order.customer.tier} (\${order.customer.loyaltyPoints} points)', style: const TextStyle(fontSize: 10, color: Color(0xFF0284C7), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // 3. SHIPPING ADDRESS DETAILS
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(CupertinoIcons.location_solid, size: 14, color: Color(0xFF0284C7)),
                          const SizedBox(width: 6),
                          const Text('Delivery Address Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                            decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(6)),
                            child: Text(order.shippingAddress.addressType.name.toUpperCase(), style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(order.shippingAddress.recipientName, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      Text(order.shippingAddress.formattedAddress, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      Text('Contact Mobile: \${order.shippingAddress.mobileNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // 4. ITEMS ORDERED BREAKDOWN
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Ordered Items (\${order.items.length})', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      ...order.items.map((it) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(it.imageUrl, width: 44, height: 44, fit: BoxFit.cover),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(it.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                  if (it.size != null || it.color != null)
                                    Text(
                                      '\${it.color ?? ''}\${it.size != null ? ' • Size: \${it.size}' : ''}',
                                      style: const TextStyle(fontSize: 9.5, color: Color(0xFF64748B)),
                                    ),
                                  Text('Qty: \${it.quantity} x \\$\${it.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                                ],
                              ),
                            ),
                            Text('\\$\${it.total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // 5. PAYMENT & PRICING BILL
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Payment & Invoice Summary', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                      const SizedBox(height: 6),
                      Text('Method: \${order.paymentMethod}', style: const TextStyle(fontSize: 11, color: Color(0xFF15803D))),
                      Text('Status: \${order.paymentStatus} • Txn: \${order.transactionId}', style: const TextStyle(fontSize: 10, color: Color(0xFF15803D))),
                      const Divider(height: 14),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Subtotal', style: TextStyle(fontSize: 11, color: Color(0xFF334155))),
                          Text('\\$\${order.pricing.subtotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Shipping Fee', style: TextStyle(fontSize: 11, color: Color(0xFF334155))),
                          Text(order.pricing.deliveryFee == 0 ? 'FREE' : '\\$\${order.pricing.deliveryFee.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Taxes & GST', style: TextStyle(fontSize: 11, color: Color(0xFF334155))),
                          Text('\\$\${order.pricing.tax.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11)),
                        ],
                      ),
                      const Divider(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Grand Total Paid', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                          Text('\\$\${order.pricing.grandTotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF166534))),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// ADDRESS BOOK SHEET: VIEW ALL SAVED & SET DEFAULT
// -------------------------------------------------------------
class AddressBookSheet extends StatelessWidget {
  final List<CustomerLocationRes> addresses;
  final CustomerLocationRes? selectedAddress;
  final Function(CustomerLocationRes) onSelectAddress;
  final Function(int) onSetDefaultAddress;
  final VoidCallback onOpenAddAddress;

  const AddressBookSheet({
    super.key,
    required this.addresses,
    this.selectedAddress,
    required this.onSelectAddress,
    required this.onSetDefaultAddress,
    required this.onOpenAddAddress,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Delivery Locations', style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.bold)),
              ElevatedButton.icon(
                onPressed: onOpenAddAddress,
                icon: const Icon(CupertinoIcons.add, size: 14),
                label: const Text('Add Address', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0284C7),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.separated(
              itemCount: addresses.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, idx) {
                final addr = addresses[idx];
                final isSelected = selectedAddress?.id == addr.id;
                return GestureDetector(
                  onTap: () => onSelectAddress(addr),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF0F9FF) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isSelected ? const Color(0xFF0284C7) : const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          addr.addressType == CustomerAddressType.home
                              ? CupertinoIcons.house_alt
                              : (addr.addressType == CustomerAddressType.work ? CupertinoIcons.briefcase : CupertinoIcons.location),
                          color: const Color(0xFF0284C7),
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(addr.recipientName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                    decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(6)),
                                    child: Text(addr.addressType.name.toUpperCase(), style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
                                  ),
                                  if (addr.defaultAddress) ...[
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                      decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(6)),
                                      child: const Text('DEFAULT', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                                    ),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(addr.addressLine1, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                              if (addr.addressLine2 != null)
                                Text(addr.addressLine2!, style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
                              Text('\${addr.cityVillage}, \${addr.stateName} - \${addr.pincode}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                              Text('Mobile: \${addr.mobileNumber}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                              const SizedBox(height: 6),
                              if (!addr.defaultAddress)
                                GestureDetector(
                                  onTap: () => onSetDefaultAddress(addr.id),
                                  child: const Text('Set as Default Address', style: TextStyle(fontSize: 10, color: Color(0xFF0284C7), fontWeight: FontWeight.bold)),
                                ),
                            ],
                          ),
                        ),
                        if (isSelected) const Icon(CupertinoIcons.checkmark_circle_fill, color: Color(0xFF0284C7), size: 18),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// ADD ADDRESS SHEET: INTERACTIVE FORM TO ADD NEW LOCATION
// -------------------------------------------------------------
class AddAddressSheet extends StatefulWidget {
  final int customerId;
  final Function(CustomerLocationRes) onSave;

  const AddAddressSheet({
    super.key,
    required this.customerId,
    required this.onSave,
  });

  @override
  State<AddAddressSheet> createState() => _AddAddressSheetState();
}

class _AddAddressSheetState extends State<AddAddressSheet> {
  final _nameCtrl = TextEditingController(text: 'Elena Vance');
  final _phoneCtrl = TextEditingController(text: '+91 98450 12345');
  final _pincodeCtrl = TextEditingController(text: '560001');
  final _line1Ctrl = TextEditingController();
  final _line2Ctrl = TextEditingController();
  final _landmarkCtrl = TextEditingController();
  final _cityCtrl = TextEditingController(text: 'Bengaluru');
  final _stateCtrl = TextEditingController(text: 'Karnataka');
  CustomerAddressType _addressType = CustomerAddressType.home;
  bool _setAsDefault = true;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _pincodeCtrl.dispose();
    _line1Ctrl.dispose();
    _line2Ctrl.dispose();
    _landmarkCtrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (_line1Ctrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter Flat / House / Building details')),
      );
      return;
    }

    final newAddress = CustomerLocationRes(
      id: 200 + DateTime.now().millisecond,
      customerId: widget.customerId,
      recipientName: _nameCtrl.text.trim().isEmpty ? 'Elena Vance' : _nameCtrl.text.trim(),
      countryName: 'India',
      stateName: _stateCtrl.text.trim().isEmpty ? 'Karnataka' : _stateCtrl.text.trim(),
      districtName: _cityCtrl.text.trim(),
      pincode: _pincodeCtrl.text.trim().isEmpty ? '560001' : _pincodeCtrl.text.trim(),
      addressLine1: _line1Ctrl.text.trim(),
      addressLine2: _line2Ctrl.text.trim().isEmpty ? null : _line2Ctrl.text.trim(),
      cityVillage: _cityCtrl.text.trim().isEmpty ? 'Bengaluru' : _cityCtrl.text.trim(),
      landmark: _landmarkCtrl.text.trim().isEmpty ? null : _landmarkCtrl.text.trim(),
      mobileNumber: _phoneCtrl.text.trim().isEmpty ? '+91 98450 12345' : _phoneCtrl.text.trim(),
      addressType: _addressType,
      defaultAddress: _setAsDefault,
    );

    widget.onSave(newAddress);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 14),
          Text('Add Delivery Address', style: GoogleFonts.cormorantGaramond(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),

          Expanded(
            child: ListView(
              children: [
                _buildTextField('Recipient Full Name', _nameCtrl, 'e.g. Elena Vance'),
                _buildTextField('Mobile Phone Number', _phoneCtrl, 'e.g. +91 98450 12345'),
                Row(
                  children: [
                    Expanded(child: _buildTextField('Pincode (6 digits)', _pincodeCtrl, '560001')),
                    const SizedBox(width: 10),
                    Expanded(child: _buildTextField('City / Town', _cityCtrl, 'Bengaluru')),
                  ],
                ),
                _buildTextField('House No., Building, Apartment', _line1Ctrl, 'e.g. Villa 18, Palm Meadows'),
                _buildTextField('Road, Street, Area Colony', _line2Ctrl, 'e.g. Phase 2, Varthur Main Road'),
                _buildTextField('Nearby Landmark (Optional)', _landmarkCtrl, 'e.g. Near Metro / Forum Mall'),
                _buildTextField('State', _stateCtrl, 'e.g. Karnataka'),
                const SizedBox(height: 8),

                // Address Type Selection
                const Text('Address Type', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _buildTypeChip('Home', CustomerAddressType.home),
                    const SizedBox(width: 8),
                    _buildTypeChip('Work', CustomerAddressType.work),
                    const SizedBox(width: 8),
                    _buildTypeChip('Other', CustomerAddressType.other),
                  ],
                ),
                const SizedBox(height: 12),

                // Default switch
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Make Default Delivery Address', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    Switch(
                      value: _setAsDefault,
                      activeColor: const Color(0xFF0284C7),
                      onChanged: (val) => setState(() => _setAsDefault = val),
                    ),
                  ],
                ),
              ],
            ),
          ),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0284C7),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              onPressed: _submit,
              child: const Text('Save & Use Delivery Address', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController ctrl, String hint) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF475569))),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: TextField(
              controller: ctrl,
              style: const TextStyle(fontSize: 12),
              decoration: InputDecoration(
                hintText: hint,
                hintStyle: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                border: InputBorder.none,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypeChip(String label, CustomerAddressType type) {
    final isSelected = _addressType == type;
    return GestureDetector(
      onTap: () => setState(() => _addressType = type),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0284C7) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 4: SAVED WISHLIST SCREEN
// -------------------------------------------------------------
class WishlistTab extends StatelessWidget {
  final Set<String> wishlistIds;
  final Function(Product) onOpenProduct;
  final Function(String) onRemove;

  const WishlistTab({
    super.key,
    required this.wishlistIds,
    required this.onOpenProduct,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final items = sampleProducts.where((p) => wishlistIds.contains(p.id)).toList();

    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
            child: Text('Saved Wishlist', style: GoogleFonts.cormorantGaramond(fontSize: 28, fontWeight: FontWeight.bold)),
          ),
          if (items.isEmpty)
            const Expanded(
              child: Center(child: Text('No saved items yet', style: TextStyle(color: Color(0xFF94A3B8)))),
            )
          else
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 90),
                itemCount: items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, idx) {
                  final p = items[idx];
                  return GestureDetector(
                    onTap: () => onOpenProduct(p),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.network(p.imageUrl, width: 60, height: 60, fit: BoxFit.cover),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                Text('\\$\${p.price.toStringAsFixed(2)}', style: const TextStyle(color: Color(0xFF0284C7), fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(CupertinoIcons.trash, size: 18, color: Colors.redAccent),
                            onPressed: () => onRemove(p.id),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 5: PROFILE TAB (CUSTOMER PROFILE, ADDRESSES, ORDERS)
// -------------------------------------------------------------
class ProfileTab extends StatelessWidget {
  final Customer customer;
  final CustomerLocationRes? selectedAddress;
  final VoidCallback onOpenAddressBook;
  final VoidCallback onOpenAddAddress;
  final VoidCallback onOpenOrders;
  final VoidCallback onOpenStyleAdvisor;
  final int addressCount;
  final int orderCount;

  const ProfileTab({
    super.key,
    required this.customer,
    this.selectedAddress,
    required this.onOpenAddressBook,
    required this.onOpenAddAddress,
    required this.onOpenOrders,
    required this.onOpenStyleAdvisor,
    required this.addressCount,
    required this.orderCount,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 90),
        children: [
          GlassContainer(
            borderRadius: 24,
            padding: const EdgeInsets.all(20),
            opacity: 0.9,
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: const Color(0xFFE0F2FE),
                  child: Text(customer.avatarInitials, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF0284C7))),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(customer.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(customer.email, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    Text('Phone: \${customer.phone}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFE0F2FE), borderRadius: BorderRadius.circular(6)),
                      child: Text('\${customer.tier} • \${customer.loyaltyPoints} pts', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF0284C7))),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          GlassContainer(
            borderRadius: 20,
            opacity: 0.9,
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(CupertinoIcons.location_solid, color: Color(0xFF0284C7), size: 20),
                  title: const Text('Saved Delivery Addresses', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: Text('\$addressCount saved addresses', style: const TextStyle(fontSize: 11)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Color(0xFF94A3B8)),
                  onTap: onOpenAddressBook,
                ),
                const Divider(height: 1, indent: 48),
                ListTile(
                  leading: const Icon(CupertinoIcons.add_circled_solid, color: Color(0xFF059669), size: 20),
                  title: const Text('Add New Delivery Address', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Create new shipping location', style: const TextStyle(fontSize: 11)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Color(0xFF94A3B8)),
                  onTap: onOpenAddAddress,
                ),
                const Divider(height: 1, indent: 48),
                ListTile(
                  leading: const Icon(CupertinoIcons.cube_box, color: Color(0xFF0284C7), size: 20),
                  title: const Text('My Orders & Tracking', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: Text('\$orderCount orders history', style: const TextStyle(fontSize: 11)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Color(0xFF94A3B8)),
                  onTap: onOpenOrders,
                ),
                const Divider(height: 1, indent: 48),
                ListTile(
                  leading: const Icon(CupertinoIcons.sparkles, color: Color(0xFF0284C7), size: 20),
                  title: const Text('AI Style Match Advisor', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  subtitle: const Text('Find tailored outfits and capsules', style: TextStyle(fontSize: 11)),
                  trailing: const Icon(CupertinoIcons.chevron_right, size: 14, color: Color(0xFF94A3B8)),
                  onTap: onOpenStyleAdvisor,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// STYLE ADVISOR SHEET: AI CURATION MATCHING WEB
// -------------------------------------------------------------
class StyleAdvisorSheet extends StatefulWidget {
  final List<Product> products;
  final Function(Product) onAddToCart;
  final Function(Product) onOpenProduct;

  const StyleAdvisorSheet({
    super.key,
    required this.products,
    required this.onAddToCart,
    required this.onOpenProduct,
  });

  @override
  State<StyleAdvisorSheet> createState() => _StyleAdvisorSheetState();
}

class _StyleAdvisorSheetState extends State<StyleAdvisorSheet> {
  String _vibe = 'minimal';
  String _occasion = 'day';

  @override
  Widget build(BuildContext context) {
    final matches = widget.products.take(3).toList();

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(width: 38, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2))),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(CupertinoIcons.sparkles, color: Color(0xFF0284C7)),
              const SizedBox(width: 8),
              Text('AI Style Advisor', style: GoogleFonts.cormorantGaramond(fontSize: 26, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          const Text('Select your vibe and occasion to generate your personalized fashion capsule.', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
          const SizedBox(height: 16),

          const Text('1. Your Vibe', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 6),
          Row(
            children: [
              _buildChoiceChip('Minimalist', 'minimal', _vibe, (v) => setState(() => _vibe = v)),
              const SizedBox(width: 8),
              _buildChoiceChip('Statement Glam', 'statement', _vibe, (v) => setState(() => _vibe = v)),
              const SizedBox(width: 8),
              _buildChoiceChip('Everyday Luxe', 'everyday', _vibe, (v) => setState(() => _vibe = v)),
            ],
          ),
          const SizedBox(height: 14),

          const Text('2. The Occasion', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 6),
          Row(
            children: [
              _buildChoiceChip('Daytime Brunch', 'day', _occasion, (v) => setState(() => _occasion = v)),
              const SizedBox(width: 8),
              _buildChoiceChip('Evening Gala', 'evening', _occasion, (v) => setState(() => _occasion = v)),
              const SizedBox(width: 8),
              _buildChoiceChip('Office / Work', 'work', _occasion, (v) => setState(() => _occasion = v)),
            ],
          ),
          const SizedBox(height: 20),

          const Text('Curated Capsule Matches', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.separated(
              itemCount: matches.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final p = matches[idx];
                return Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.network(p.imageUrl, width: 48, height: 48, fit: BoxFit.cover),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p.name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold), maxLines: 1),
                            Text('\\$\${p.price.toStringAsFixed(2)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF0284C7))),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0284C7),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () => widget.onAddToCart(p),
                        child: const Text('Add', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChoiceChip(String label, String value, String current, Function(String) onSelect) {
    final isSelected = current == value;
    return GestureDetector(
      onTap: () => onSelect(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF334155),
          ),
        ),
      ),
    );
  }
}
`;
