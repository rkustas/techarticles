import { useEffect, useRef, useState } from "react";

const FadeInSection = ({ children }) => {
  // Reference
  const domRef = useRef();

  // State
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    });
    observer.observe(domRef.current);
  }, []);

  return (
    <section ref={domRef} className={isVisible ? "is-visible" : ""}>
      {children}
    </section>
  );
};

export default FadeInSection;
