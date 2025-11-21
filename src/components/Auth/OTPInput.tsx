// src/components/Auth/OTPInput.tsx
import { useEffect, useRef, type ChangeEvent, type ClipboardEvent } from "react";

interface OTPInputProps {
    length?: number;
    value: string;
    setValue: (val: string) => void;
}

export default function OTPInput({ length = 6, value, setValue }: OTPInputProps) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        // Focus first box when rendered
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = value.split("");
        newOtp[index] = e.target.value.replace(/[^0-9]/g, ""); // only digits
        setValue(newOtp.join(""));

        if (e.target.value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").trim();
        if (/^\d+$/.test(paste)) {
            const digits = paste.slice(0, length).split("");
            setValue(digits.join(""));
            digits.forEach((d, i) => {
                if (inputsRef.current[i]) inputsRef.current[i]!.value = d;
            });
            inputsRef.current[length - 1]?.focus();
        }
    };

    return (
        <div
            className="flex gap-2 justify-center"
            onPaste={handlePaste}
        >
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        inputsRef.current[i] = el;
                    }} type="text"
                    maxLength={1}
                    className="w-10 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleChange(e, i)}
                    onFocus={(e) => e.target.select()}
                />
            ))}
        </div>
    );
}
