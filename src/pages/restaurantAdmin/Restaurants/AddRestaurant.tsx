// components/AddRestaurant.tsx
import { apiPost } from "@/api/apis";
import React, { useState, useEffect } from "react";

type FormState = {
  restaurantName: string;
  fssaiLicense: string;
  address: string;
  restaurantImage?: File | null;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailAddress: string;
};

type Props = {
  onSave: () => void;
  editData?: {
    restaurantName: string;
    fssaiLicense: string;
    address: string;
    adminName: string;
    mobileNumber: string;
    location: string;
    image: string;
  } | null;
  isEditMode?: boolean;
};

const AddRestaurant: React.FC<Props> = ({ onSave, editData, isEditMode = false }) => {
  const [form, setForm] = useState<FormState>({
    restaurantName: "",
    fssaiLicense: "",
    address: "",
    restaurantImage: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailAddress: "",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      // Split admin name into first and last name
      const nameParts = editData.adminName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setForm({
        restaurantName: editData.restaurantName,
        fssaiLicense: editData.fssaiLicense,
        address: editData.location,
        restaurantImage: null, // Can't pre-fill file input
        firstName: firstName,
        lastName: lastName,
        mobileNumber: editData.mobileNumber.replace('+91 ', ''), // Remove country code
        emailAddress: "", // Not available in current data structure
      });
    }
  }, [isEditMode, editData]);

  // Validation functions
  const validateName = (name: string, fieldName: string) => {
    if (!name.trim()) {
      return `${fieldName} is required`;
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      return `${fieldName} should only contain letters and spaces`;
    }
    if (name.trim().length < 2) {
      return `${fieldName} must be at least 2 characters long`;
    }
    return null;
  };

  const validateMobileNumber = (mobile: string) => {
    if (!mobile.trim()) {
      return "Mobile number is required";
    }
    if (!/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    if (parseInt(mobile[0]) < 6) {
      return "Mobile number should start with 6, 7, 8, or 9";
    }
    return null;
  };

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    
    // Restaurant name validation (only for add mode)
    if (!isEditMode) {
      const restaurantNameError = validateName(form.restaurantName, "Restaurant name");
      if (restaurantNameError) newErrors.restaurantName = restaurantNameError;
    }

    // FSSAI License validation (only for add mode)
    if (!isEditMode) {
      if (!form.fssaiLicense.trim()) newErrors.fssaiLicense = "FSSAI license number is required";
    }

    // Address validation
    if (!form.address.trim()) newErrors.address = "Address is required";

    // First name validation
    const firstNameError = validateName(form.firstName, "First name");
    if (firstNameError) newErrors.firstName = firstNameError;

    // Last name validation
    const lastNameError = validateName(form.lastName, "Last name");
    if (lastNameError) newErrors.lastName = lastNameError;

    // Mobile number validation
    const mobileError = validateMobileNumber(form.mobileNumber);
    if (mobileError) newErrors.mobileNumber = mobileError;

    // Email validation (optional but if provided should be valid)
    if (form.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    let processedValue = value;
    
    // Special handling for name fields - only allow letters and spaces
    if (name === 'firstName' || name === 'lastName' || name === 'restaurantName') {
      processedValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    
    // Special handling for mobile number - only allow digits and limit to 10
    if (name === 'mobileNumber') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : processedValue,
    }));
  };

  const handleFocus = (fieldName: keyof FormState) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("form data ready to be submitted:", form);
    if(isEditMode) {
      // Handle edit logic here (API call, state update, etc.)
      // http://localhost:3100/api/canteen/createCanteen
      const response = await apiPost('/canteen/createCanteen', form);
      console.log("Updating restaurant with data: response", response);
    }else{
      // Handle add logic here (API call, state update, etc.)
      console.log("Adding new restaurant with data:", form);
    }
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">
          {isEditMode ? 'Edit Restaurant & Admin' : 'Add New Restaurant & Admin'}
        </h2>
        <p className="text-gray-600">
          {isEditMode ? 'Update restaurant and admin details' : 'Create a new restaurant and assign admin details'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Restaurant Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            {isEditMode ? 'Edit Restaurant Information' : 'Restaurant Information'}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Restaurant Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Restaurant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                onFocus={() => handleFocus('restaurantName')}
                placeholder="Enter restaurant name (letters and spaces only)"
                disabled={isEditMode} // Disabled in edit mode
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  isEditMode 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : errors.restaurantName 
                      ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.restaurantName && !isEditMode && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.restaurantName}
                </p>
              )}
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">Restaurant name cannot be changed</p>
              )}
            </div>
            
            {/* FSSAI License */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                FSSAI License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fssaiLicense"
                value={form.fssaiLicense}
                onChange={handleChange}
                onFocus={() => handleFocus('fssaiLicense')}
                placeholder="Enter FSSAI license number"
                disabled={isEditMode} // Disabled in edit mode
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  isEditMode 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : errors.fssaiLicense 
                      ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.fssaiLicense && !isEditMode && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fssaiLicense}
                </p>
              )}
              {isEditMode && (
                <p className="text-xs text-gray-500 mt-1">FSSAI license number cannot be changed</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                onFocus={() => handleFocus('address')}
                placeholder="Enter complete address"
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 resize-none transition-all duration-200 ${
                  errors.address 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.address && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.address}
                </p>
              )}
            </div>
            
            {/* Restaurant Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Restaurant Image <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  name="restaurantImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="restaurant-image"
                />
                <label htmlFor="restaurant-image" className="cursor-pointer block">
                  <div className="text-gray-400 mb-3">
                    <svg className="mx-auto h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">Choose Image</span>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  {form.restaurantImage && (
                    <p className="text-xs text-green-600 mt-2 font-medium">{form.restaurantImage.name}</p>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-black mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Restaurant Manager Details
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onFocus={() => handleFocus('firstName')}
                placeholder="Enter first name (letters and spaces only)"
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.firstName 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.firstName}
                </p>
              )}
            </div>
            
            {/* Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onFocus={() => handleFocus('lastName')}
                placeholder="Enter last name (letters and spaces only)"
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.lastName 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                onFocus={() => handleFocus('mobileNumber')}
                placeholder="Enter 10-digit mobile (starts with 6-9)"
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.mobileNumber 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.mobileNumber && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobileNumber}
                </p>
              )}
            </div>
            
            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                name="emailAddress"
                value={form.emailAddress}
                onChange={handleChange}
                onFocus={() => handleFocus('emailAddress')}
                placeholder="Enter email address"
                className={`w-full px-4 py-3 border rounded-lg text-sm text-black placeholder-gray-400 transition-all duration-200 ${
                  errors.emailAddress 
                    ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:ring-3`}
              />
              {errors.emailAddress && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.emailAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-200 transition-all duration-200 shadow-lg"
          >
            {isEditMode ? 'Update Restaurant' : 'Save Restaurant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
