import React, { useState, useEffect } from "react";
import { addPropertyControls, ControlType } from "framer";

const BASE_URL = "https://syncsphere-hiv6.onrender.com";

export default function CoursesSection(props) {
  const { cardBackgroundColor, accentColor } = props;

  const [status, setStatus] = useState("loading");
  const [courses, setCourses] = useState([]);
  const [countryCode, setCountryCode] = useState("US");

  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchData = async () => {
    setStatus("loading");
    try {
      const [coursesRes, countryRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/assignment/course-data`),
        fetch(`${BASE_URL}/assignment/country-code`),
      ]);

      if (coursesRes.status === "rejected" || !coursesRes.value.ok) {
        throw new Error("Failed to fetch courses");
      }

      const coursesData = await coursesRes.value.json();

      if (!coursesData || coursesData.length === 0) {
        setStatus("empty");
        return;
      }

      if (countryRes.status === "fulfilled" && countryRes.value.ok) {
        const countryData = await countryRes.value.json();
        setCountryCode(countryData.country_code || "US");
      } else {
        setCountryCode("US");
      }

      setCourses(coursesData);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (course, code) => {
    if (code === "IN") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(course.pricePaise / 100);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(course.priceUsdCents / 100);
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif",
    },
    grid: { display: "grid", gap: "24px" },
    card: {
      backgroundColor: cardBackgroundColor,
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      border: "1px solid #eee",
      cursor: "pointer",
    },

    title: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0 0 12px 0",
      color: "#111",
    },
    desc: {
      fontSize: "16px",
      color: "#666",
      margin: "0 0 16px 0",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "1.5",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
    },
    price: { fontSize: "20px", fontWeight: "bold", color: "#000" },
    category: {
      fontSize: "14px",
      backgroundColor: accentColor,
      padding: "6px 10px",
      borderRadius: "4px",
      color: "#444",
    },
    messageBox: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#555",
      fontSize: "18px",
    },
    retryBtn: {
      marginTop: "16px",
      padding: "12px 24px",
      backgroundColor: accentColor,
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
    },

    modalOverlay: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
      animation: "fadeIn 0.2s ease",
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "32px",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto",
      position: "relative",
      boxSizing: "border-box",
      animation: "scaleIn 0.2s ease",
    },

    modalTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "12px",
      color: "#111",
      paddingRight: "24px",
    },
    modalDesc: {
      fontSize: "18px",
      color: "#555",
      lineHeight: 1.6,
      marginBottom: "20px",
    },

    badge: {
      display: "inline-block",
      backgroundColor: accentColor,
      color: "#000",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "6px 12px",
      borderRadius: "4px",
      marginBottom: "24px",
    },
    modalInfoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #eee",
      fontSize: "16px",
      color: "#333",
    },
    modalInfoLabel: { fontWeight: "bold", color: "#666" },
    modalBuyBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: accentColor,
      color: "#000",
      border: "none",
      borderRadius: "8px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "24px",
    },
    closeBtn: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "none",
      border: "none",
      fontSize: "28px",
      cursor: "pointer",
      color: "#999",
    },
  };

  if (status === "loading") {
    return (
      <div style={{ ...styles.container, ...styles.messageBox }}>
        Loading courses...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ ...styles.container, ...styles.messageBox }}>
        <p>Unable to fetch data.</p>
        <button style={styles.retryBtn} onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div style={{ ...styles.container, ...styles.messageBox }}>
        No courses available right now. Check back later.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
                .course-grid {
                    grid-template-columns: repeat(3, 1fr); 
                }
                @media (max-width: 900px) {
                    .course-grid {
                        grid-template-columns: repeat(2, 1fr); 
                    }
                }
                @media (max-width: 600px) {
                    .course-grid {
                        grid-template-columns: 1fr; 
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>

      <div className="course-grid" style={styles.grid}>
        {courses.map((course, index) => (
          <div
            key={course.mangoId || index}
            className="course-card"
            style={styles.card}
            onClick={() => setSelectedCourse(course)}
          >
            <div>
              <h3 style={styles.title}>{course.courseName}</h3>
              <p style={styles.desc}>{course.description}</p>
            </div>

            <div style={styles.footer}>
              <span style={styles.price}>
                {formatPrice(course, countryCode)}
              </span>
              <span style={styles.category}>{course.mainCategory}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedCourse(null)}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeBtn}
              onClick={() => setSelectedCourse(null)}
            >
              &times;
            </button>

            <h2 style={styles.modalTitle}>{selectedCourse.courseName}</h2>
            <p style={styles.modalDesc}>{selectedCourse.description}</p>

            <div>
              {selectedCourse.refundable && (
                <span style={styles.badge}>Refundable</span>
              )}
            </div>

            <div style={styles.modalInfoRow}>
              <span style={styles.modalInfoLabel}>Short Name:</span>
              <span>{selectedCourse.shortCourse}</span>
            </div>
            <div style={styles.modalInfoRow}>
              <span style={styles.modalInfoLabel}>Category:</span>
              <span>{selectedCourse.mainCategory}</span>
            </div>
            <div style={styles.modalInfoRow}>
              <span style={styles.modalInfoLabel}>Course Type:</span>
              <span>{selectedCourse.courseType}</span>
            </div>
            <div style={styles.modalInfoRow}>
              <span style={styles.modalInfoLabel}>Price (USD):</span>
              <span>${selectedCourse.priceUsdCents / 100}</span>
            </div>
            <div style={styles.modalInfoRow}>
              <span style={styles.modalInfoLabel}>Price (INR):</span>
              <span>₹{selectedCourse.pricePaise / 100}</span>
            </div>

            <button
              style={styles.modalBuyBtn}
              onClick={() => alert("This is a dummy button!")}
            >
              Buy Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

addPropertyControls(CoursesSection, {
  cardBackgroundColor: {
    type: ControlType.Color,
    title: "Card BG Color",
    defaultValue: "#ffffff",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent Color",
    defaultValue: "#ffbb00",
  },
});
