import { useState } from 'react';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [isClicked, setIsClicked] = useState(false);

  const contactCards = [
    { role: 'Owner', name: 'Nilutal Chetia', email: 'nilutalchetia@example.com' },
  ];

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setIsClicked(true);
        toast.success(`✉️ Email copied! You can now contact at ${email}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            fontSize: '14px',
          },
        });
        setTimeout(() => setIsClicked(false), 200);
      })
      .catch(err => console.error('Failed to copy email:', err));
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 py-14 space-y-20">

      {/* Page Title */}
      <div className="text-center">
        <Title text1="CONTACT" text2="US" />
        <p className="text-gray-600 mt-3 text-base md:text-lg">
          We’d love to hear from you. Whether it’s about our products or your order, we’re here to help.
        </p>
      </div>

      {/* Contact Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
        {contactCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3"
          >
            <p className="font-semibold text-lg text-gray-900">{card.role}</p>
            <p className="text-gray-700">{card.name}</p>
            <p className="text-gray-500">{card.email}</p>
            <button
              onClick={() => handleCopyEmail(card.email)}
              className={`mt-4 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium transition-transform duration-150 hover:bg-gray-800 ${isClicked ? 'scale-95' : 'scale-100'}`}
            >
              Copy Email
            </button>
          </div>
        ))}
      </div>

      {/* Contact Info / Support Section */}
      <section className="flex flex-col md:flex-row gap-12 items-center bg-gray-50 p-10 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl md:text-3xl font-light text-gray-900">Get in Touch with Forever</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            Have questions about our collections, shipping, or returns? You can reach out directly to our owner at the email above.
          </p>
          <p className="text-gray-600 text-base leading-relaxed">
            For technical support or website-related queries, visit{" "}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              NexxUpp.com
            </a>{" "}
            — the creative minds behind Forever’s online presence.
          </p>
          <a href="https://nexxupp.com" target="_blank" rel="noopener noreferrer">
            <button className="mt-5 bg-black text-white px-8 py-3 rounded-full text-sm md:text-base font-medium hover:bg-gray-800 transition-all duration-300">
              Visit NexxUpp
            </button>
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewaLetterBox />

      {/* Developer Credit */}
      <div className="text-center text-sm text-gray-500 py-10">
        <p>
          Website developed by{" "}
          <b>
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              NexxUpp.com
            </a>
          </b>
        </p>
        <p>Contact: contact@nexxupp.com</p>
      </div>
    </div>
  );
};

export default Contact;
