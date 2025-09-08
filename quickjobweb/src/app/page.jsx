"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [heroTitle, setHeroTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const texts = [
    " Welcome to QuickJob...!",
    " Sri Lanka's NO: 01 Micro Job Platform...",
  ];
  const [textIndex, setTextIndex] = useState(0);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add loading animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 800);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Typing effect for hero title
  useEffect(() => {
    let currentText = texts[textIndex];
    let currentLength = 0;
    const typingInterval = setInterval(() => {
      setHeroTitle((prev) => prev + currentText[currentLength]);
      currentLength++;
      if (currentLength === currentText.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setHeroTitle("");
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 1000);
      }
    }, 300);
    return () => clearInterval(typingInterval);
  }, [textIndex]);
  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 10px #32CD32, 0 0 20px #32CD32, 0 0 30px #32CD32;
          }
          to {
            text-shadow: 0 0 20px #32CD32, 0 0 30px #32CD32, 0 0 40px #32CD32;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Hover effects */
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .button-link:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(50, 205, 50, 0.4);
        }
        
        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 40px rgba(50, 205, 50, 0.4);
        }
        
        .about-text:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .about-image:hover {
          transform: scale(1.05);
        }
        
        .contact-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 45px rgba(255, 255, 255, 0.1);
        }
        
        .contact-left:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 45px rgba(255, 255, 255, 0.1);
        }
        
        .contact-input:focus,
        .contact-textarea:focus {
          border-color: rgba(50, 205, 50, 0.6);
          box-shadow: 0 0 20px rgba(50, 205, 50, 0.3);
          outline: none;
        }
        
        .contact-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 40px rgba(50, 205, 50, 0.4);
        }
        
        .contact-item:hover {
          transform: translateX(10px);
        }
      `}</style>
      
      {/* Navigation Bar */}
      <nav style={{
        ...styles.navbar,
        backgroundColor: scrollY > 50 ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(15px)",
        transition: "all 0.3s ease-in-out",
        boxShadow: scrollY > 50 ? "0 4px 30px rgba(0, 0, 0, 0.3)" : "none"
      }}>
        <div style={{
          ...styles.logo,
          transform: isLoaded ? "scale(1)" : "scale(0.8)",
          opacity: isLoaded ? 1 : 0,
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease"
        }}>
          <Image src="/quickjoblogo.png" alt="QuickJob Logo" width={100} height={100} />
        </div>        <div style={styles.links}>
          {["home", "about", "contact"].map((section) => (
            <Link key={section} href={`#${section}`} style={styles.navLink} className="nav-link">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Link>
          ))}
        </div>
        <div style={styles.buttons}>
          <Link href="/signin" style={styles.buttonLink} className="button-link">
            Sign In
          </Link>
          <Link href="/chooserole" style={styles.buttonLink} className="button-link">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.slider}>
          <div
            style={{
              ...styles.imageWrapper,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "scale(1.1)" : "scale(1)",
              transition: "transform 1.5s ease-in-out, opacity 1.5s ease-in-out",
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              width={1920}
              height={800}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Hero Text */}
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{heroTitle}</h1>
          <p style={styles.heroSubtitle}>
            Join QuickJob and connect with top job suppliers and skilled employees in Sri Lanka.
            Get started today to grow your microjob opportunities!!!
          </p>          {/* Sign Up Button and "It's free..." text */}
          <div style={styles.ctaContainer}>
            <Link href="/chooserole" style={styles.ctaButton} className="cta-button">
              Sign Up
            </Link>
            <p style={styles.freeText}>It&apos;s free...</p>
          </div>
        </div>
      </section>      {/* About Section */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.imageContainer}>
          <Image
            src="/quickjoblogo.png"
            alt="About Image"
            width={600}
            height={400}
            style={styles.aboutImage}
            className="about-image"
          />
        </div>
        <div style={styles.aboutText} className="about-text">
          <h2 style={styles.aboutTitle}>About Us</h2>
          <div style={styles.aboutParagraph}>
            We are the one and only Microjob finding platform in Sri Lanka. There are two parties
            who can benefit from our platform. Job suppliers can find qualified employees
            instantly, and employees can find jobs suitable for their qualifications.
          </div>
        </div>
      </section>      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <div style={styles.contactLeft} className="contact-left">
          <h2 style={styles.contactTitle}>Contact Us</h2>
          <div style={styles.contactInfo}>
            <div style={styles.contactItem} className="contact-item">
              <span style={styles.contactIcon}>📞</span>
              <span>Tel: 011 1100 110</span>
            </div>
            <div style={styles.contactItem} className="contact-item">
              <span style={styles.contactIcon}>💬</span>
              <Link href="https://wa.me/94764787444" target="_blank" style={styles.contactLink}>
                WhatsApp: (+94) 764787444
              </Link>
            </div>
            <div style={styles.contactItem} className="contact-item">
              <span style={styles.contactIcon}>✉️</span>
              <span>Email: info.quickjob@gmail.com</span>
            </div>
          </div>
        </div>

        <div style={styles.contactRight}>
          <form style={styles.contactForm} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              style={styles.contactInput}
              className="contact-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              style={styles.contactInput}
              className="contact-input"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              style={styles.contactTextarea}
              className="contact-textarea"
              required
            />
            <button type="submit" style={styles.contactButton} className="contact-button">
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

// Styles
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    position: "fixed",
    width: "100%",
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    zIndex: 1000,
    transition: "all 0.3s ease-in-out",
  },
  logo: { 
    display: "flex", 
    alignItems: "center",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
  },
  links: {
    display: "flex",
    gap: "2rem",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    position: "relative",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
  },
  buttonLink: {
    backgroundColor: "rgba(53, 58, 53, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    padding: "0.5rem 1.5rem",
    borderRadius: "25px",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(50, 205, 50, 0.3)",
  },  heroSection: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    overflow: "hidden",
    textAlign: "center",
  },
  slider: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  imageWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    color: "white",
    padding: "0 20px",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transform: "translateY(0)",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  heroTitle: {
    fontSize: "4.5rem",
    fontWeight: "bold",
    marginBottom: "3rem",
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
    background: "linear-gradient(45deg, #ffffff, #32CD32)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "glow 2s ease-in-out infinite alternate",
  },
  heroSubtitle: {
    fontSize: "2rem",
    lineHeight: "1.5",
    marginBottom: "2rem",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    textShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
    color: "#F0F0F0",
    opacity: 0.9,
  },
  ctaContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  ctaButton: {
    background: "linear-gradient(45deg, #32CD32, #228B22)",
    color: "#fff",
    padding: "1rem 3rem",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.2rem",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(50, 205, 50, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
  },
  freeText: {
    fontSize: "1.2rem",
    color: "#fff",
    fontStyle: "italic",
    opacity: 0.8,
    animation: "pulse 2s infinite",
  },  aboutSection: {
    padding: "6rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "4rem",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 51, 0, 0.8), rgba(230, 211, 0, 0.1))",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  aboutImage: {
    maxWidth: "100%",
    borderRadius: "20px",
    filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  aboutTitle: {
    fontSize: "3.5rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "2rem",
    background: "linear-gradient(45deg, #475149ff, #279f27ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  aboutParagraph: {
    fontSize: "1.8rem",
    lineHeight: "1.6",
    maxWidth: "600px",
    color: "#333",
    fontWeight: 500,
  },
  aboutText: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(15px)",
    padding: "3rem",
    borderRadius: "25px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    maxWidth: "600px",
    margin: "auto",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "translateY(0)",
  },
  contactSection: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #000000, #003300, #e6d300)",    
  },
  contactTitle: {
    fontSize: "3rem",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(45deg, #ffffff, #32CD32)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  contactLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  contactRight: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    fontSize: "1.2rem",
    color: "#FFFFFF",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "0.5rem 0",
    transition: "transform 0.3s ease",
  },
  contactIcon: {
    fontSize: "1.5rem",
  },
  contactLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  contactForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  contactInput: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    transition: "all 0.3s ease",
  },
  contactTextarea: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    resize: "vertical",
    minHeight: "150px",
    transition: "all 0.3s ease",
  },
  contactButton: {
    padding: "1rem 2rem",
    background: "linear-gradient(45deg, #32CD32, #228B22)",
    borderRadius: "25px",
    color: "#fff",
    fontSize: "1.2rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 32px rgba(50, 205, 50, 0.3)",
    backdropFilter: "blur(10px)",
  },
};

export default HomePage;
