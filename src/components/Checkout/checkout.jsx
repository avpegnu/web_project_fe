import React, { useState, useContext, useEffect } from "react";
import "./checkout.css";
import { ShopContext } from "../../context/ShopContext";
// import { createPaymentRequest } from "../../services/payment";
import arrow_icon from "../assets/arrow.png";
import { FaAddressCard } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { createOrder } from "../../services/order";
import { getStorageData } from "../../helpers/stored";
import { HelmetProvider } from "react-helmet-async";
import address from "../assets/address.json";

// const provinces = [
//   {
//     name: "Hà Nội",
//     districts: [
//       { name: "Ba Đình", wards: ["Phúc Xá", "Trúc Bạch", "Vĩnh Phúc"] },
//       { name: "Hoàn Kiếm", wards: ["Chương Dương", "Cửa Đông", "Hàng Bạc"] },
//     ],
//   },
//   {
//     name: "TP Hồ Chí Minh",
//     districts: [
//       { name: "Quận 1", wards: ["Bến Nghé", "Bến Thành", "Cầu Ông Lãnh"] },
//       { name: "Quận 3", wards: ["Phường 1", "Phường 2", "Phường 3"] },
//     ],
//   },
// ];

const Checkout = () => {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  useEffect(() => {
    setProvinces(address);
  }, []);
  const {
    getSelectedTotalAmount,
    selectedItems,
    cartItems,
    allProduct,
    removeSelectedItemsFromCart,
  } = useContext(ShopContext);

  useEffect(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    if (savedStep) {
      setStep(parseInt(savedStep));
    }
  }, []);

  const [step, setStep] = useState(1);
  // const formatCurrency = (value) => {
  //   return value.toLocaleString("vi-VN") + "đ";
  // };

  // const parsePrice = (str) => parseInt(str.replace(/\./g, ""), 10);

  const nextStep = async () => {
    if (step === 1 && !validateForm()) return;

    if (step === 2 && !paymentMethod) {
      setPaymentMethodError(true);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmitOrder = async () => {
    const orderData = {
      user_id: getStorageData("user")?.id || "",
      order_status: "pending",
      payment_status: "pending",
      order_items: Object.entries(cartItems)
        .filter(([key]) => selectedItems.includes(key))
        .map(([key, quantity]) => {
          const [productId, size] = key.split("_");
          return {
            ...allProduct.find((p) => p._id === productId),
            size,
            quantity,
          };
        }),
      shipping_address: formData,
      payment_method: paymentMethod,
      order_total: getSelectedTotalAmount(),
    };

    try {
      const response = await createOrder(orderData);
      console.log("Order response:", response);

      if (paymentMethod === "VNPay_bank_transfer") {
        window.location.href = response.data;
      } else {
        window.location.href = response;
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setTimeout(() => {
        removeSelectedItemsFromCart();
      }, 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const icons = [FaAddressCard, MdOutlinePayment, GiConfirmed];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Full name cannot be left blank";
    } else if (!/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(formData.name)) {
      newErrors.name = "Full name can only contain letters and spaces";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number cannot be blank";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number. Please re-enter.";
    }
    if (!formData.city) {
      newErrors.city = "Please select Province/City";
    } else {
      if (!formData.district) {
        newErrors.district = "Please select District";
      } else {
        if (!formData.ward) newErrors.ward = "Please select Ward/Commune";
      }
    }
    if (!formData.address)
      newErrors.address = "Detailed address cannot be left blank";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const user = getStorageData("user");
  const userId = user?.id || "guest"; // fallback nếu chưa đăng nhập
  const addressKey = `checkoutAddress_${userId}`;

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    localStorage.setItem(addressKey, JSON.stringify(newFormData));
  };

  useEffect(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    if (savedStep) {
      setStep(parseInt(savedStep));
    }

    const savedAddress = localStorage.getItem(addressKey);
    if (savedAddress) {
      setFormData(JSON.parse(savedAddress));
    }
  }, []);

  // const selectedProvince = provinces.find((p) => p.FullName === formData.city);
  // const selectedDistrict = selectedProvince?.District.find(
  //   (d) => d.FullName === formData.district
  // );

  const handleProvinceChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({ ...formData, city: selectedCity, district: "", ward: "" });

    const province = provinces.find(
      (province) => province.FullName === selectedCity
    );
    setSelectedProvince(province);
    console.log("Selected City:", selectedCity);
    console.log("Matched Province:", province);
  };
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData({ ...formData, district: selectedDistrict, ward: "" });
    setSelectedDistrict(
      selectedProvince.District.find(
        (district) => district.FullName === selectedDistrict
      )
    );
  };
  const handleWardChange = (e) => {
    setFormData({ ...formData, ward: e.target.value });
  };

  const [paymentMethodError, setPaymentMethodError] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "VNPay_bank_transfer":
        return "VNPay Banking";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <HelmetProvider>
        <title>Checkout</title>
      </HelmetProvider>
      <section className="section">
        <div className="checkout-container">
          <div className="checkout-title">
            {[
              "Address information",
              "Payment method",
              "Payment confirmation",
            ].map((label, index) => {
              const Icon = icons[index];
              return (
                <>
                  <div key={index} className="checkout-step">
                    <div
                      className={`checkout-icon-container ${
                        step > index ? "bg-active" : "bg-inactive"
                      }`}
                    >
                      <Icon className="icon-step" />
                    </div>
                    <span className="checkout-label">{label}</span>
                  </div>
                  <div
                    className={`${index < 2 ? "checkout-divider" : ""}`}
                  ></div>
                </>
              );
            })}
          </div>
          <p className="checkout-title-step">
            {step === 1 && "Address information"}
            {step === 2 && "Payment method"}
            {step === 3 && "Payment confirmation"}
          </p>
        </div>
      </section>

      <div className="checkout-content">
        <div className="checkout-content container">
          {step === 1 && (
            <>
              {/* Form nhập thông tin địa chỉ */}
              <div className="checkout-content">
                <div className="checkout-content container">
                  <div className="checkout-row">
                    <div className="checkout-input-group">
                      <p className="checkout-label-info">
                        Full Name <span>*</span>
                      </p>
                      <input
                        className="checkout-input"
                        type="text"
                        placeholder="Ex: Nguyễn Việt Anh"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p className="checkout-error">{errors.name}</p>
                      )}
                    </div>
                    <div className="checkout-input-group">
                      <p className="checkout-label-info ">
                        Phone Number <span>*</span>
                      </p>
                      <input
                        className="checkout-input"
                        type="text"
                        placeholder="Ex: 0123456789"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="checkout-error">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="checkout-row">
                    <div className="checkout-select-group">
                      <p className="checkout-label-info">
                        Province/City <span>*</span>
                      </p>
                      <select
                        name="city"
                        className="checkout-input"
                        value={formData.city}
                        onChange={handleProvinceChange}
                      >
                        <option value="">Select Province/City</option>
                        {provinces?.map((province, index) => (
                          <option
                            key={province?.Code || index}
                            value={province?.FullName}
                          >
                            {province?.FullName}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="checkout-error">{errors.city}</p>
                      )}
                    </div>
                    <div className="checkout-select-group">
                      <p className="checkout-label-info">
                        District <span>*</span>
                      </p>
                      <select
                        name="district"
                        className="checkout-input"
                        value={formData.district}
                        onChange={handleDistrictChange}
                      >
                        <option value="">Select District</option>
                        {selectedProvince &&
                          selectedProvince?.District?.map((district, index) => (
                            <option
                              key={district?.Code || index}
                              value={district?.FullName}
                            >
                              {district?.FullName}
                            </option>
                          ))}
                      </select>
                      {errors.district && (
                        <p className="checkout-error">{errors.district}</p>
                      )}
                    </div>
                    <div className="checkout-select-group">
                      <p className="checkout-label-info">
                        Ward <span>*</span>
                      </p>
                      <select
                        name="ward"
                        className="checkout-input"
                        value={formData.ward}
                        onChange={handleWardChange}
                      >
                        <option value="">Select Ward</option>
                        {selectedDistrict &&
                          selectedDistrict?.Ward?.map((ward, index) => (
                            <option
                              key={ward?.Code || index}
                              value={ward?.FullName}
                            >
                              {ward?.FullName}
                            </option>
                          ))}
                      </select>
                      {errors.ward && (
                        <p className="checkout-error">{errors.ward}</p>
                      )}
                    </div>
                  </div>
                  <div
                    className="checkout-input-group"
                    style={{ width: "100%" }}
                  >
                    <p className="checkout-label-info">
                      Address: <span>*</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Ex: Xã Trường Yên, Huyện Chương Mỹ, Thành phố Hà Nội"
                      className="checkout-input"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <p className="checkout-error">{errors.address}</p>
                    )}
                  </div>
                  <div
                    className="checkout-input-group"
                    style={{ width: "100%" }}
                  >
                    <p className="checkout-label-info">Note:</p>
                    <input
                      type="text"
                      placeholder="Note here..."
                      className="checkout-input"
                      name="address"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="checkout-method-title">Select payment method</p>
              <div className="checkout-method-container">
                <label className="checkout-method-item">
                  <input
                    type="radio"
                    name="payment"
                    value="VNPay_bank_transfer"
                    checked={paymentMethod === "VNPay_bank_transfer"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentMethodError(false);
                    }}
                  />
                  <span>VNPay Banking</span>
                </label>

                <label className="checkout-method-item">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentMethodError(false);
                    }}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              {paymentMethodError && (
                <p className="checkout-error">Please select payment method.</p>
              )}
            </>
          )}

          {step === 3 && (
            <div className="checkout-confirm-container">
              <div className="checkout-confirm-content">
                {/* Sản phẩm được chọn */}
                <div className="checkout-products">
                  {Object.entries(cartItems)
                    .filter(([key]) => selectedItems.includes(key))
                    .map(([key, quantity]) => {
                      if (quantity <= 0) return null;

                      const [productId, size] = key.split("_");
                      const product = allProduct.find(
                        (p) => p._id === productId
                      );
                      if (!product) return null;

                      return (
                        <div key={key} className="checkout-product-card">
                          <div className="checkout-product-info">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="checkout-product-img"
                            />
                            <p className="checkout-product-name">
                              {product.name}
                            </p>
                          </div>
                          <div
                            className="checkout-product-details"
                            style={{ marginRight: "20px" }}
                          >
                            <p>Size: {size}</p>
                            <p>Price: ${product.new_price}</p>
                            <p>Quantity: {quantity}</p>
                          </div>
                          <div className="checkout-product-total">
                            <p className="total-label">Total</p>
                            <p className="total-price">
                              ${product.new_price * quantity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Xác nhận thanh toán */}
                <div className="checkout-summary">
                  <div>
                    <p className="checkout-summary-title">Delivery address:</p>
                    <p className="checkout-summary-text">
                      {formData.name} - {formData.phone}
                      <br />
                      {formData.address}, {formData.ward}, {formData.district},{" "}
                      {formData.city}
                    </p>
                  </div>

                  <div>
                    <p className="checkout-summary-title">Payment method:</p>
                    <p className="checkout-summary-text">
                      {getPaymentMethodLabel(paymentMethod)}
                    </p>
                  </div>

                  <div>
                    <div className="checkout-price-line">
                      <span>Order fee:</span>
                      <span>${getSelectedTotalAmount()}</span>
                    </div>
                    <div className="checkout-price-line">
                      <span>Shipping fee:</span>
                      <span>Free</span>
                    </div>
                    <hr className="checkout-divider" />
                    <div className="checkout-price-total">
                      <span>Total:</span>
                      <span>${getSelectedTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            {step > 1 && (
              <button className="button-back" onClick={prevStep}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button className="button-next" onClick={nextStep}>
                Next{" "}
                <img
                  src={arrow_icon}
                  alt="-->"
                  style={{ margin: "2px 0 0 16px" }}
                />
              </button>
            ) : (
              <button className="button-confirm" onClick={handleSubmitOrder}>
                {paymentMethod === "Cash on Delivery"
                  ? "Confirm and Pay on Delivery"
                  : "Confirm and Pay Online"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
