"use client";
import React, { useState } from 'react';
import RevealText from '@/components/animation/RevealText';

export default function ContactPage() {
    const [result, setResult] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (data: FormData) => {
        const newErrors: Record<string, string> = {};

        // Name validation
        const name = data.get("name") as string;
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name || !name.trim()) {
            newErrors.name = "Full name is required";
        } else if (name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters long";
        } else if (!nameRegex.test(name)) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        // Email validation
        const email = data.get("email") as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email address is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (Indian format - 10 digits)
        const phone = data.get("phone") as string;
        const phoneRegex = /^[6-9]\d{9}$/;
        const numberOnlyRegex = /^\d+$/;

        if (!phone) {
            newErrors.phone = "Contact number is required";
        } else if (!numberOnlyRegex.test(phone)) {
            newErrors.phone = "Phone number can only contain digits";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Please enter a valid 10-digit mobile number starting with 6-9";
        }

        // Subject/Purpose validation
        const subject = data.get("subject") as string;
        if (!subject) {
            newErrors.subject = "Please select a topic";
        }

        // Message validation
        const message = data.get("message") as string;
        if (!message || !message.trim()) {
            newErrors.message = "Message is required";
        } else if (message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters long";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Prevent typing numbers in name
        if (name === "name") {
            e.target.value = value.replace(/[^A-Za-z\s]/g, "");
        }

        // Prevent typing alphabets/special chars in phone and limit to 10 digits
        if (name === "phone") {
            const digits = value.replace(/\D/g, "");
            e.target.value = digits.slice(0, 10);
        }

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("");

        const formData = new FormData(event.currentTarget);

        if (!validateForm(formData)) {
            return;
        }

        setIsSubmitting(true);
        setResult("Sending....");

        // Ideally an environment variable should be used
        formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "");
        formData.append("to", "shivamgupta80004@gmail.com"); // Replaced with user-specified email 

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Form Submitted Successfully! We'll get back to you soon.");
                (event.target as HTMLFormElement).reset();
                setErrors({});
            } else {
                console.log("Error", data);
                setResult(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setResult("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-black min-h-screen text-white">
            <div className="relative h-[80dvh] w-full overflow-hidden z-0">
                <img src="/gellery-img/gallery-img-5.png" alt="" className='h-full w-full object-cover object-top' />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                {/* Content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4 w-full">
                    <div className="overflow-hidden mb-3">
                        <RevealText
                            type="chars"
                            className="text-5xl md:text-7xl font-semibold text-white tracking-tight"
                            stagger={0.03}
                        >
                            Contact Us
                        </RevealText>
                    </div>

                    <div className="mx-auto">
                        <RevealText
                            type="words"
                            className="text-xl md:text-2xl text-white/80 font-light leading-relaxed"
                            stagger={0.01}
                            delay={0.5}
                        >
                            We’d love to hear from you, Send us your thoughts and questions.
                        </RevealText>
                    </div>

                </div>

            </div>

            <section className="py-0 px-4 md:px-8 max-w-2xl mx-auto mb-24">
                <form onSubmit={onSubmit} className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-accent-warm/30 backdrop-blur-sm" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">
                                Name <span className="text-orange-500">*</span>
                            </label>
                            <input
                                name="name"
                                onChange={handleInputChange}
                                type="text"
                                required
                                className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                                placeholder="Your Name"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm uppercase tracking-wider text-white/60">
                                Phone Number <span className="text-orange-500">*</span>
                            </label>
                            <input
                                name="phone"
                                onChange={handleInputChange}
                                type="tel"
                                required
                                className={`w-full bg-black/50 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                                placeholder="Your Phone Number"
                            />
                            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">
                            Email <span className="text-orange-500">*</span>
                        </label>
                        <input
                            name="email"
                            onChange={handleInputChange}
                            type="email"
                            className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                            placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">
                            Subject <span className="text-orange-500">*</span>
                        </label>
                        <select
                            name="subject"
                            onChange={handleInputChange}
                            required
                            className={`w-full bg-black/50 border ${errors.subject ? 'border-red-500' : 'border-white/20'} rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer`}
                            defaultValue=""
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff60' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 16px center',
                            }}
                        >
                            <option value="" disabled className="bg-black text-white/50">Select a topic</option>
                            <option value="general" className="bg-black text-white">General Enquiry</option>
                            <option value="register-event" className="bg-black text-white">Event Registration</option>
                            <option value="collaboration" className="bg-black text-white">Collaboration</option>
                            <option value="feedback" className="bg-black text-white">Feedback</option>
                            <option value="volunteering" className="bg-black text-white">Volunteering</option>
                            <option value="other" className="bg-black text-white">Others</option>
                        </select>
                        {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm uppercase tracking-wider text-white/60">
                            Message <span className="text-orange-500">*</span>
                        </label>
                        <textarea
                            name="message"
                            onChange={handleInputChange}
                            className={`w-full bg-black/50 border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-xl p-4 text-white h-32 focus:outline-none focus:border-orange-500 transition-colors`}
                            placeholder="Write your message here..."
                        ></textarea>
                        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-linear-to-r from-orange-600 to-red-600 rounded-xl font-semibold text-white tracking-wide hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                            </>
                        ) : 'Send Message'}
                    </button>

                    {result && (
                        <div className={`p-4 rounded-xl text-center font-medium ${result.includes("Successfully")
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : result.includes("Sending")
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                            {result}
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
}
