import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Package, 
  MapPin, 
  Clock,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useOrderWorkflow, CATEGORIES } from '../../contexts/OrderWorkflowContext';

const OrderPlacement = ({ category = CATEGORIES.GROCERY, customerId, onOrderPlaced }) => {
  const { placeOrder } = useOrderWorkflow();
  const { toast } = useToast();
  
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Mock product catalog by category
  const productCatalog = {
    [CATEGORIES.GROCERY]: [
      { id: 'g1', name: 'Organic Bananas', price: 45, unit: 'bunch', image: '🍌' },
      { id: 'g2', name: 'Whole Milk', price: 65, unit: 'liter', image: '🥛' },
      { id: 'g3', name: 'Whole Wheat Bread', price: 40, unit: 'loaf', image: '🍞' },
      { id: 'g4', name: 'Free Range Eggs', price: 120, unit: 'dozen', image: '🥚' },
      { id: 'g5', name: 'Greek Yogurt', price: 85, unit: 'cup', image: '🍦' }
    ],
    [CATEGORIES.PHARMACY]: [
      { id: 'p1', name: 'Vitamin D3 Tablets', price: 250, unit: 'bottle', image: '💊' },
      { id: 'p2', name: 'Pain Relief Gel', price: 180, unit: 'tube', image: '🧴' },
      { id: 'p3', name: 'Hand Sanitizer', price: 120, unit: 'bottle', image: '🧽' },
      { id: 'p4', name: 'Digital Thermometer', price: 450, unit: 'piece', image: '🌡️' },
      { id: 'p5', name: 'First Aid Kit', price: 350, unit: 'kit', image: '🩹' }
    ],
    [CATEGORIES.ELECTRONICS]: [
      { id: 'e1', name: 'Wireless Headphones', price: 2500, unit: 'piece', image: '🎧' },
      { id: 'e2', name: 'Phone Charger', price: 750, unit: 'piece', image: '🔌' },
      { id: 'e3', name: 'Screen Protector', price: 300, unit: 'piece', image: '📱' },
      { id: 'e4', name: 'Bluetooth Speaker', price: 3500, unit: 'piece', image: '🔊' },
      { id: 'e5', name: 'Power Bank', price: 1800, unit: 'piece', image: '🔋' }
    ],
    [CATEGORIES.FOOD_DELIVERY]: [
      { id: 'f1', name: 'Margherita Pizza', price: 320, unit: 'piece', image: '🍕' },
      { id: 'f2', name: 'Chicken Biryani', price: 280, unit: 'plate', image: '🍛' },
      { id: 'f3', name: 'Caesar Salad', price: 180, unit: 'bowl', image: '🥗' },
      { id: 'f4', name: 'Chocolate Cake', price: 220, unit: 'slice', image: '🍰' },
      { id: 'f5', name: 'Fresh Juice', price: 120, unit: 'glass', image: '🧃' }
    ]
  };

  const products = productCatalog[category] || [];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const total = getTotalAmount();
    return total < 500 ? 40 : 0; // Free delivery above ₹500
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order",
        variant: "destructive"
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Missing Address",
        description: "Please provide a delivery address",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Simulate order placement delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        customerId: customerId || 'customer_001',
        customerName: 'John Doe', // Would come from user context
        storeId: 'store_001',
        category,
        items: cart.map(item => ({
          ...item,
          barcode: `${item.id}_${Date.now()}`,
          status: 'pending'
        })),
        totalAmount: getTotalAmount() + getDeliveryFee(),
        deliveryFee: getDeliveryFee(),
        deliveryAddress,
        paymentMethod,
        specialInstructions,
        estimatedDeliveryTime: category === CATEGORIES.FOOD_DELIVERY ? 30 : 60
      };

      placeOrder(orderData);

      toast({
        title: "Order Placed Successfully!",
        description: `Your ${category} order has been placed and sent to the store for confirmation`,
      });

      // Reset form
      setCart([]);
      setDeliveryAddress('');
      setPaymentMethod('');
      setSpecialInstructions('');

      if (onOrderPlaced) {
        onOrderPlaced(orderData);
      }

    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const categoryConfig = {
    [CATEGORIES.GROCERY]: { 
      title: 'Grocery Store', 
      icon: '🛒', 
      color: 'bg-green-50 border-green-200' 
    },
    [CATEGORIES.PHARMACY]: { 
      title: 'Pharmacy', 
      icon: '💊', 
      color: 'bg-blue-50 border-blue-200' 
    },
    [CATEGORIES.ELECTRONICS]: { 
      title: 'Electronics', 
      icon: '📱', 
      color: 'bg-purple-50 border-purple-200' 
    },
    [CATEGORIES.FOOD_DELIVERY]: { 
      title: 'Food Delivery', 
      icon: '🍔', 
      color: 'bg-orange-50 border-orange-200' 
    }
  };

  const config = categoryConfig[category];

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <Card className={config.color}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{config.icon}</span>
            <span>{config.title}</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{product.image}</span>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">₹{product.price}/{product.unit}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {cart.find(item => item.id === product.id) ? (
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-medium">
                            {cart.find(item => item.id === product.id)?.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart & Checkout */}
        <div className="space-y-6">
          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cart.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getTotalAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{getDeliveryFee()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{getTotalAmount() + getDeliveryFee()}</span>
                    </div>
                    {getDeliveryFee() === 0 && (
                      <p className="text-green-600 text-xs">Free delivery!</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Delivery Address *</label>
                <Textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Payment Method *</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Special Instructions</label>
                <Textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special delivery instructions..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Estimated delivery: {category === CATEGORIES.FOOD_DELIVERY ? '30 minutes' : '60 minutes'}
                </span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isPlacingOrder ? (
                  <>
                    <Package className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Place Order (₹{getTotalAmount() + getDeliveryFee()})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;