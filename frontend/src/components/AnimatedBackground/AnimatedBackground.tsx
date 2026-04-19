import { useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.css";

export default function AnimatedBackground() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <div className={styles.bg}>
            <div ref={cursorRef} className={styles.cursor} />
            <div className={styles.grid} />
        </div>
    );
}
