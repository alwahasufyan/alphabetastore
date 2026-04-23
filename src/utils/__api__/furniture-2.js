import { cache } from "react";
import { fetchProducts } from "utils/catalog";

// CUSTOM DATA MODELS

const getNewArrivalProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getTrendingProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getTestimonial = cache(async () => {
  return [{
    id: "testimonial-1",
    comment: "Excellent furniture quality and prompt delivery.",
    user: {
      name: "Maya Ibrahim",
      designation: "Home Owner",
      avatar: "/assets/images/faces/7.png"
    }
  }, {
    id: "testimonial-2",
    comment: "The ordering flow was smooth and support was responsive.",
    user: {
      name: "Omar Khaled",
      designation: "Interior Designer",
      avatar: "/assets/images/faces/6.png"
    }
  }];
});

const getServices = cache(async () => {
  return [{
    id: "service-delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "On-time delivery for all furniture orders"
  }, {
    id: "service-quality",
    icon: "Verified",
    title: "Premium Quality",
    description: "Durable products and trusted materials"
  }, {
    id: "service-payment",
    icon: "CreditCard",
    title: "Secure Payment",
    description: "Safe checkout with multiple methods"
  }, {
    id: "service-support",
    icon: "CustomerService",
    title: "24/7 Support",
    description: "Dedicated support when you need help"
  }];
});
export default {
  getNewArrivalProducts,
  getTrendingProducts,
  getTestimonial,
  getServices
};