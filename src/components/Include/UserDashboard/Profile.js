"use client";
import React, { useEffect, useState } from "react";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateUser } from "@/app/redux/slices/updateUser/updateUserSlice";
import toast from "react-hot-toast";
import { useCountries, getStates, getCities, fetchPincodeData } from "@/lib/CustomHook/useCountries";
import ReactSelect from "react-select";
import { parsePhoneNumberFromString, getExampleNumber } from "libphonenumber-js";

// Dynamic phone Yup validation
const getPhoneYup = (countryCode) =>
    Yup.string()
        .required("Phone is required")
        .test("is-valid-phone", "Enter a valid phone number", (value) => {
            if (!value) return false;
            try {
                const phoneNumber = parsePhoneNumberFromString(value, countryCode);
                return phoneNumber ? phoneNumber.isValid() : false;
            } catch {
                return false;
            }
        });

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.me);
    const { countries } = useCountries();
    const [loadingPin, setLoadingPin] = useState(false);

    const [preview, setPreview] = useState(null);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        if (!user) dispatch(fetchMe());
        if (user) {
            setSelectedCountry(user.country || "");
            setSelectedState(user.state || "");
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (selectedCountry) {
            setLoadingStates(true);
            getStates(selectedCountry)
                .then((res) => setStates(res))
                .finally(() => setLoadingStates(false));
            setCities([]);
            setSelectedState("");
        }
    }, [selectedCountry]);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return Array.isArray(data.urls) ? data.urls[0] : data.urls;
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>

            <Formik
                enableReinitialize
                initialValues={{
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    gender: user?.gender || "",
                    address: user?.address || "",
                    country: user?.country || "",
                    state: user?.state || "",
                    city: user?.city || "",
                    pincode: user?.pincode || "",
                    profileImage: null,
                }}
                validationSchema={Yup.object().shape({
                    phone: getPhoneYup(
                        countries.find((c) => c.name === selectedCountry)?.code
                    ),
                    gender: Yup.string().required("Gender is required"),
                    address: Yup.string().required("Address is required"),
                    country: Yup.string().required("Country is required"),
                    state: Yup.string().required("State is required"),
                    city: Yup.string().required("City is required"),
                    // pincode: Yup.string()
                    //     .required("Pincode is required"),

                })}
                onSubmit={async (values) => {
                    try {
                        if (values.profileImage) {
                            const uploadedImageUrl = await handleImageUpload(values.profileImage);
                            values.profileImage = uploadedImageUrl;
                        }
                        const response = await dispatch(updateUser(values)).unwrap();
                        toast.success(response.message || "User updated successfully!");
                    } catch (err) {
                        toast.error(err.message || "Failed to update user!");
                    }
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg">

                        {/* Profile Image */}
                        <div className="md:col-span-2 flex flex-col items-center">
                            <label className="mb-4 font-medium text-gray-700">Profile Picture</label>
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100 overflow-hidden cursor-pointer group">
                                    {preview ? (
                                        <img key={preview} src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : user?.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-600">
                                            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                                        </span>
                                    )}
                                    <span className="absolute bottom-0 bg-black/60 text-white text-xs px-2 py-1 rounded-b-full opacity-0 group-hover:opacity-100 transition">
                                        Click to upload
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFieldValue("profileImage", file);
                                                setPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Name & Email */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Name</label>
                            <Field name="name" type="text" readOnly className="w-full border p-3 h-10 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Email</label>
                            <Field name="email" type="email" readOnly className="w-full border h-10 p-3 text-gray-500 cursor-not-allowed" />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Gender</label>
                            <Field as="select" name="gender" className="w-full border h-10 p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </Field>
                            <ErrorMessage name="gender" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                         {/* Country */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Country</label>
                            <ReactSelect
                                options={countries.map(c => ({ value: c.name, label: `${c.name} (${c.phoneCode})` }))}
                                value={selectedCountry ? { value: selectedCountry, label: selectedCountry } : null}
                                onChange={(option) => {
                                    const countryName = option?.value || "";
                                    setSelectedCountry(countryName);
                                    setFieldValue("country", countryName);
                                    setFieldValue("state", "");
                                    setFieldValue("city", "");
                                     setFieldValue("pincode", ""); 
                                    setCities([]);
                                    const phoneCode = countries.find(c => c.name === countryName)?.phoneCode;
                                    if (phoneCode && !values.phone.startsWith(phoneCode)) {
                                        setFieldValue("phone", phoneCode + " ");
                                    }
                                }}
                                isClearable
                                placeholder="Select Country..."
                            />
                            <ErrorMessage name="country" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Pincode */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">
                                Pincode/ postalcode
                            </label>
                            <Field name="pincode">
                                {({ field, form }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        className="w-full border h-10 p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        onChange={async (e) => {
                                            const value = e.target.value;
                                            form.setFieldValue("pincode", value);

                                            // Only call API if country is India
                                            if (values.country === "India" && value.length === 6) {
                                                const isValid = await fetchPincodeData(value, form.setFieldValue);
                                            }
                                        }}
                                        placeholder="Enter Pincode"
                                    />
                                )}
                            </Field>

                            <ErrorMessage
                                name="pincode"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>


                       

                        {/* State */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">State</label>
                            <ReactSelect
                                options={states.map(s => ({ value: s, label: s }))}
                                value={values.state ? { value: values.state, label: values.state } : null}
                                onChange={(option) => {
                                    setFieldValue("state", option?.value || "");
                                    setSelectedState(option?.value || "");
                                    setCities([]);
                                    setFieldValue("city", "");
                                    if (option?.value && selectedCountry) {
                                        setLoadingCities(true);
                                        getCities(selectedCountry, option.value).then((res) => {
                                            setCities(res);
                                            setLoadingCities(false);
                                        });
                                    }
                                }}
                                isClearable
                                isLoading={loadingStates}
                                placeholder="Select State..."
                            />
                            <ErrorMessage name="state" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* City */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">City</label>
                            <ReactSelect
                                options={cities.map(c => ({ value: c, label: c }))}
                                value={values.city ? { value: values.city, label: values.city } : null}
                                onChange={(option) => setFieldValue("city", option?.value || "")}
                                isClearable
                                isLoading={loadingCities}
                                placeholder="Select City..."
                            />
                            <ErrorMessage name="city" component="p" className="text-red-500 text-sm mt-1" />
                        </div>



                        {/* Phone */}
                        <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-700">Phone Number</label>
                            <Field name="phone">
                                {({ field, form }) => {
                                    const phoneCode = countries.find(c => c.name === values.country)?.phoneCode || "+";
                                    const numberPart = field.value?.replace(/^\+\d+\s*/, "") || "";
                                    return (
                                        <input
                                            type="tel"
                                            value={`${phoneCode} ${numberPart}`}
                                            placeholder={`${phoneCode} 98765 43210`}
                                            className="w-full border h-10 p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            onChange={(e) => {
                                                const newNumber = e.target.value.replace(/^\+\d+\s*/, "");
                                                form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                            }}
                                            onPaste={(e) => {
                                                const pasteData = e.clipboardData.getData("text");
                                                const newNumber = pasteData.replace(/^\+\d+\s*/, "");
                                                form.setFieldValue("phone", `${phoneCode} ${newNumber}`);
                                                e.preventDefault();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.target.selectionStart <= phoneCode.length && ["Backspace", "Delete"].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    );
                                }}
                            </Field>
                            <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-2 font-medium text-gray-700">Address</label>
                            <Field name="address" type="text" className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="123 Street, City, State, 12345" />
                            <ErrorMessage name="address" component="p" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition cursor-pointer">
                                Update Profile
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
