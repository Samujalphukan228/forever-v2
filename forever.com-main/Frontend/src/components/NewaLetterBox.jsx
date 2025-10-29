import React, { useState } from "react";

const FeedbackBox = () => {
    const [form, setForm] = useState({ name: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback submitted:", form);
        alert("Thanks for your feedback!");
        setForm({ name: "", message: "" });
    };

    return (
        <div className="text-center py-12 px-4 sm:px-0 ">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                Share Your Thoughts
            </h2>
            <p className="text-gray-500 mt-3 sm:text-base max-w-md mx-auto">
                We value your feedback — tell us what you love or what we can improve.
            </p>

            <form
                onSubmit={handleSubmit}
                className="w-full sm:w-1/2 flex flex-col gap-4 mx-auto my-8 border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
            >
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black"
                    required
                />
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-black h-28 resize-none"
                    required
                ></textarea>

                <button
                    type="submit"
                    className="bg-black text-white font-medium py-3 rounded-md hover:bg-gray-800 transition-all duration-300"
                >
                    Send Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackBox;
