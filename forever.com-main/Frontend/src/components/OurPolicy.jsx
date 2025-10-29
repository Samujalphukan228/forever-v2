import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      desc: "Hassle-free exchanges for all your purchases.",
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Return Policy",
      desc: "Enjoy 7 days of free returns with ease.",
    },
    {
      icon: assets.support_img,
      title: "Best Customer Support",
      desc: "Our team is available 24/7 to assist you.",
    },
  ];

  return (
    <div className="py-20 ">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-semibold text-gray-900 mb-14">
          Our Commitment to You
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-12 sm:gap-8 text-center">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 group transition-all duration-500 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-black/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <img
                  src={policy.icon}
                  alt={policy.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text */}
              <div>
                <p className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                  {policy.title}
                </p>
                <p className="text-gray-500 max-w-xs mx-auto leading-relaxed text-sm sm:text-base">
                  {policy.desc}
                </p>
              </div>

              {/* Decorative Line */}
              <div className="h-[2px] w-0 bg-black/80 group-hover:w-12 transition-all duration-500 mt-3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
