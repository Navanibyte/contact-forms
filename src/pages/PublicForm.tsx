/* eslint-disable no-case-declarations */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "./integration";

// interface Form {
//     id: string;
//     title: string;
//     description: string | null;
// }

// interface FormField {
//     id: string;
//     field_type: string;
//     label: string;
//     placeholder: string | null;
//     required: boolean;
//     options: string[] | null;
//     position: number;
// }

// const PublicForm = () => {
//     const { id } = useParams();
//     const [form, setForm] = useState<Form | null>(null);
//     const [fields, setFields] = useState<FormField[]>([]);

//     // const load = async () => {
//     //     const { data: formData } = await supabase
//     //         .from("forms")
//     //         .select("*")
//     //         .eq("id", id)
//     //         .single();

//     //     const { data: fieldData } = await supabase
//     //         .from("form_fields")
//     //         .select("*")
//     //         .eq("form_id", id)
//     //         .order("position");

//     //     setForm(formData as Form);
//     //     setFields((fieldData as FormField[]) || []);
//     // };
//     const load = async () => {
//         try {
//             const response = await fetch(
//                 `http://localhost:3000/forms/${id}`,
//                 {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             // ---------------------------
//             // CASE A: Form NOT found (new form mode)
//             // ---------------------------
//             if (response.status === 404) {
//                 setForm({
//                     id: id || "",
//                     title: "",
//                     description: "",
//                 });

//                 setFields([]);
//                 return;
//             }

//             // ---------------------------
//             // CASE B: Form FOUND
//             // ---------------------------
//             const data = await response.json();

//             setForm({
//                 id: data.form_id,
//                 title: data.title,
//                 description: data.description,
//             });

//             setFields(
//                 data.fields?.sort((a: any, b: any) => a.position - b.position) || []
//             );
//         } catch (err: any) {
//             console.error("Load Error:", err);
//             setForm(null);
//             setFields([]);
//         }
//     };


//     useEffect(() => {
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         load();
//     }, [id]);

//     const renderField = (field: FormField) => {
//         switch (field.field_type) {
//             case "heading":
//                 return `
//                     <h3 class="pf-heading">${field.label}</h3>
//                 `;

//             case "text":
//             case "email":
//             case "phone":
//                 return `
//                 <div class="pf-field">
//                     <label>${field.label}${field.required ? " *" : ""}</label>
//                     <input
//                         type="${field.field_type}"
//                         name="${field.id}"
//                         placeholder="${field.placeholder || ""}"
//                         ${field.required ? "required" : ""}
//                     />
//                 </div>`;

//             case "textarea":
//                 return `
//                 <div class="pf-field">
//                     <label>${field.label}${field.required ? " *" : ""}</label>
//                     <textarea
//                         name="${field.id}"
//                         placeholder="${field.placeholder || ""}"
//                         ${field.required ? "required" : ""}
//                     ></textarea>
//                 </div>`;

//             case "checkbox":
//                 return `
//                 <div class="pf-field pf-checkbox-row">
//                     <input type="checkbox" name="${field.id}" ${field.required ? "required" : ""}/>
//                     <label>${field.label}</label>
//                 </div>`;

//             case "select":
//                 return `
//                 <div class="pf-field">
//                     <label>${field.label}${field.required ? " *" : ""}</label>
//                     <select name="${field.id}" ${field.required ? "required" : ""}>
//                         ${(field.options || []).map((o) => `<option>${o}</option>`).join("")}
//                     </select>
//                 </div>`;

//             case "date":
//                 return `
//                 <div class="pf-field">
//                     <label>${field.label}${field.required ? " *" : ""}</label>
//                     <input type="date" name="${field.id}" ${field.required ? "required" : ""}/>
//                 </div>`;

//             default:
//                 return "";
//         }
//     };

//     if (!form) return <p>Loading...</p>;

//     return (
//         <div
//             dangerouslySetInnerHTML={{
//                 __html: `
// <style>
//     body {
//         background: #f8f9fc;
//     }

//     .pf-container {
//         max-width: 650px;
//         margin: 40px auto;
//         padding: 32px;
//         background: #ffffff;
//         border-radius: 18px;
//         font-family: Inter, sans-serif;
//         box-shadow: 0 4px 14px rgba(0,0,0,0.06);
//     }

//     .pf-title {
//         font-size: 28px;
//         font-weight: 700;
//         margin-bottom: 4px;
//         color: #1f2937;
//     }

//     .pf-desc {
//         color: #6b7280;
//         margin-bottom: 24px;
//         font-size: 15px;
//     }

//     .pf-heading {
//         font-size: 22px;
//         font-weight: 600;
//         margin: 28px 0 10px;
//         color: #1f2937;
//     }

//     .pf-field {
//         margin-bottom: 20px;
//         display: flex;
//         flex-direction: column;
//     }

//     .pf-field label {
//         margin-bottom: 6px;
//         font-weight: 500;
//         color: #374151;
//     }

//     .pf-field input,
//     .pf-field textarea,
//     .pf-field select {
//         padding: 12px;
//         border: 1px solid #d1d5db;
//         background: #f9fafb;
//         border-radius: 10px;
//         font-size: 15px;
//     }

//     .pf-field textarea {
//         height: 100px;
//         resize: vertical;
//     }

//     .pf-checkbox-row {
//         display: flex;
//         gap: 10px;
//         align-items: center;
//     }

//     .pf-submit {
//         width: 100%;
//         padding: 14px;
//         background: #f97316;
//         color: white;
//         border-radius: 10px;
//         border: none;
//         cursor: pointer;
//         font-size: 17px;
//         margin-top: 10px;
//         font-weight: 600;
//     }

//     .pf-submit:hover {
//         background: #ea580c;
//     }
// </style>

// <div class="pf-container">
//     <div class="pf-title">${form.title}</div>
//     <div class="pf-desc">${form.description || ""}</div>

//     <form action="${window.location.origin}/submit/${id}" method="POST">
//         ${fields.map(renderField).join("")}
//         <button class="pf-submit" type="submit">Submit</button>
//     </form>
// </div>
// `,
//             }}
//         />
//     );
// };

// export default PublicForm;


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";

// interface Form {
//     id: string;
//     title: string | null;
//     description: string | null;
// }

// interface FormField {
//     id: string;
//     field_type: string;
//     label: string;
//     placeholder: string | null;
//     required: boolean;
//     options: string[] | null;
//     position: number;
// }

// const PublicForm = () => {
//     const { id } = useParams();
//     const [form, setForm] = useState<Form | null>(null);
//     const [fields, setFields] = useState<FormField[]>([]);
//     const [formData, setFormData] = useState<Record<string, any>>({});
//     const [message, setMessage] = useState("");
//     const formRef = useRef<HTMLFormElement>(null);

//     /** LOAD FORM */
//     const load = async () => {
//         try {
//             const response = await fetch(`http://localhost:3000/forms/${id}`);
//             if (response.status === 404) {
//                 setForm({ id: id!, title: "Form", description: "" });
//                 return;
//             }

//             const data = await response.json();
//             setForm({
//                 id: data.form_id,
//                 title: data.title,
//                 description: data.description,
//             });

//             const normalizedFields = (data.fields || [])
//                 .sort((a: any, b: any) => a.position - b.position)
//                 .map((f: any) => ({
//                     id: f.field_id,
//                     field_type: f.type,
//                     label: f.label,
//                     placeholder: f.placeholder,
//                     required: f.required,
//                     options: Array.isArray(f.options) ? f.options : [],
//                     position: f.position,
//                 }));

//             setFields(normalizedFields);

//             // Initialize formData
//             const initialFormData: Record<string, any> = {};
//             normalizedFields.forEach(f => {
//                 if (f.field_type === "checkbox") initialFormData[f.id] = false;
//                 else initialFormData[f.id] = "";
//             });
//             setFormData(initialFormData);

//         } catch (error) {
//             console.error("Error loading form:", error);
//         }
//     };

//     useEffect(() => {
//         load();
//     }, [id]);

//     /** HANDLE INPUT CHANGE */
//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//     };

//     /** GENERATE READ-ONLY HTML FOR EMAIL */
//     const generateReadOnlyHtml = (): string => {
//         let htmlFields = "";

//         fields.forEach(field => {
//             const value = formData[field.id];
//             let displayValue = value;

//             if (typeof value === "boolean") displayValue = value ? "Yes" : "No";
//             else if (!value) displayValue = "-";

//             htmlFields += `
//         <div class="field-row">
//           <div class="field-label">${field.label}</div>
//           <div class="field-value">${displayValue}</div>
//         </div>
//       `;
//         });

//         return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <style>
//           body { background: #f4f6f8; font-family: Inter, Arial, sans-serif; padding: 20px; }
//           .email-container { max-width: 650px; background: #fff; margin: 0 auto; padding: 30px; border-radius: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
//           .title { font-size: 26px; font-weight: 700; margin-bottom: 10px; color: #1f2937; }
//           .description { color: #6b7280; font-size: 15px; margin-bottom: 25px; }
//           .section-title { font-size: 20px; font-weight: 600; margin-bottom: 18px; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; }
//           .field-row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
//           .field-label { font-weight: 600; color: #374151; width: 40%; }
//           .field-value { width: 55%; color: #111827; background: #f9fafb; padding: 10px 14px; border-radius: 8px; border: 1px solid #e5e7eb; word-break: break-word; white-space: pre-wrap; font-size: 14px; }
//         </style>
//       </head>
//       <body>
//         <div class="email-container">
//           <div class="title">${form?.title || "Form Submitted"}</div>
//           <div class="description">${form?.description || ""}</div>
//           <div class="section-title">Form Submission</div>
//           ${htmlFields}
//         </div>
//       </body>
//       </html>
//     `;
//     };

//     /** SUBMIT FORM */
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage("Submitting...");

//         const htmlString = generateReadOnlyHtml();
//         const payload = {
//             form_id: form?.id,
//             html: htmlString,
//             data: formData,
//             metadata: {
//                 backgroundColor: "#f8f9fc",
//                 numberOfFields: fields.length,
//                 formTitle: form?.title,
//                 formDescription: form?.description,
//             },
//         };

//         try {
//             const res = await fetch(`http://localhost:3000/forms/${id}/submit`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: JSON.stringify(payload),
//             });

//             const data = await res.json();
//             setMessage(res.ok ? "Form submitted successfully!" : "Error: " + data.message);
//         } catch (error) {
//             setMessage("Something went wrong!");
//         }
//     };

//     /** RENDER FIELDS */
//     const renderField = (field: FormField) => {
//         switch (field.field_type) {
//             case "heading":
//                 return <h3 className="pf-heading" key={field.id}>{field.label}</h3>;

//             case "text":
//             case "email":
//             case "phone":
//             case "date":
//                 return (
//                     <div className="pf-field" key={field.id}>
//                         <label>{field.label}{field.required ? " *" : ""}</label>
//                         <input
//                             type={field.field_type}
//                             name={field.id}
//                             placeholder={field.placeholder || ""}
//                             required={field.required}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 );

//             case "textarea":
//                 return (
//                     <div className="pf-field" key={field.id}>
//                         <label>{field.label}{field.required ? " *" : ""}</label>
//                         <textarea
//                             name={field.id}
//                             placeholder={field.placeholder || ""}
//                             required={field.required}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 );

//             case "checkbox":
//                 return (
//                     <div className="pf-field pf-checkbox-row" key={field.id}>
//                         <input
//                             type="checkbox"
//                             name={field.id}
//                             required={field.required}
//                             onChange={handleChange}
//                         />
//                         <label>{field.label}</label>
//                     </div>
//                 );

//             case "select":
//                 return (
//                     <div className="pf-field" key={field.id}>
//                         <label>{field.label}{field.required ? " *" : ""}</label>
//                         <select
//                             name={field.id}
//                             required={field.required}
//                             onChange={handleChange}
//                         >
//                             {(field.options || []).map((o, i) => <option key={i}>{o}</option>)}
//                         </select>
//                     </div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     if (!form) return <p>Loading...</p>;

//     return (
//         <>
//             <style>
//                 {`
//           body { background: #f8f9fc; }
//           .pf-container { max-width: 650px; margin: 40px auto; padding: 32px; background: #ffffff; border-radius: 18px; font-family: Inter, sans-serif; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
//           .pf-title { font-size: 28px; font-weight: 700; margin-bottom: 4px; color: #1f2937; }
//           .pf-desc { color: #6b7280; margin-bottom: 24px; font-size: 15px; }
//           .pf-heading { font-size: 22px; font-weight: 600; margin: 28px 0 10px; color: #1f2937; }
//           .pf-field { margin-bottom: 20px; display: flex; flex-direction: column; }
//           .pf-field label { margin-bottom: 6px; font-weight: 500; color: #374151; }
//           .pf-field input, .pf-field textarea, .pf-field select { padding: 12px; border: 1px solid #d1d5db; background: #f9fafb; border-radius: 10px; font-size: 15px; }
//           .pf-field textarea { height: 100px; resize: vertical; }
//           .pf-checkbox-row { display: flex; gap: 10px; align-items: center; }
//           .pf-submit { width: 100%; padding: 14px; background: #f97316; color: white; border-radius: 10px; border: none; cursor: pointer; font-size: 17px; margin-top: 10px; font-weight: 600; }
//           .pf-submit:hover { background: #ea580c; }
//         `}
//             </style>

//             <div className="pf-container">
//                 <h2 className="pf-title">{form.title}</h2>
//                 <p className="pf-desc">{form.description || ""}</p>
//                 <form ref={formRef} onSubmit={handleSubmit}>
//                     {fields.map(renderField)}
//                     <button type="submit" className="pf-submit">Submit</button>
//                 </form>
//                 {message && <p style={{ marginTop: 15, fontSize: 16 }}>{message}</p>}
//             </div>
//         </>
//     );
// };

// export default PublicForm;


import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

interface FormStyles {
    container?: {
        backgroundColor?: string;
        backgroundImage?: string;
        maxWidth?: string;
        padding?: string;
        borderRadius?: string;
        boxShadow?: string;
    };
    card?: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: string;
        borderRadius?: string;
        padding?: string;
    };
    title?: {
        fontSize?: string;
        fontWeight?: string;
        color?: string;
        textAlign?: string;
    };
    description?: {
        fontSize?: string;
        color?: string;
        textAlign?: string;
    };
    fields?: {
        labelColor?: string;
        labelFontSize?: string;
        labelFontWeight?: string;
        inputBackgroundColor?: string;
        inputBorderColor?: string;
        inputBorderRadius?: string;
        inputPadding?: string;
        inputFontSize?: string;
    };
    button?: {
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        padding?: string;
        fontSize?: string;
        fontWeight?: string;
        hoverBackgroundColor?: string;
    };
}

interface FieldOption {
    id: string;
    label: string;
    value: string;
}

interface Form {
    id: string;
    title: string | null;
    description: string | null;
    styles?: FormStyles;
}

interface FormField {
    id: string;
    field_type: string;
    label: string;
    placeholder: string | null;
    required: boolean;
    options: FieldOption[] | null;
    position: number;
    width?: 'full' | 'half' | 'third';
}

// Default styles fallback
const DEFAULT_STYLES: FormStyles = {
    container: {
        backgroundColor: '#f8f9fc',
        maxWidth: '800px',
        padding: '40px',
        borderRadius: '18px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        padding: '32px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'left',
    },
    description: {
        fontSize: '15px',
        color: '#6b7280',
        textAlign: 'left',
    },
    fields: {
        labelColor: '#374151',
        labelFontSize: '14px',
        labelFontWeight: '500',
        inputBackgroundColor: '#f9fafb',
        inputBorderColor: '#d1d5db',
        inputBorderRadius: '10px',
        inputPadding: '12px',
        inputFontSize: '15px',
    },
    button: {
        backgroundColor: '#f97316',
        textColor: '#ffffff',
        borderRadius: '10px',
        padding: '14px',
        fontSize: '17px',
        fontWeight: '600',
        hoverBackgroundColor: '#ea580c',
    },
};

const PublicForm = () => {
    const { id } = useParams();
    const [form, setForm] = useState<Form | null>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [formData, setFormData] = useState<Record<string, string | boolean>>({});
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Merge form styles with defaults
    const styles = {
        container: { ...DEFAULT_STYLES.container, ...form?.styles?.container },
        card: { ...DEFAULT_STYLES.card, ...form?.styles?.card },
        title: { ...DEFAULT_STYLES.title, ...form?.styles?.title },
        description: { ...DEFAULT_STYLES.description, ...form?.styles?.description },
        fields: { ...DEFAULT_STYLES.fields, ...form?.styles?.fields },
        button: { ...DEFAULT_STYLES.button, ...form?.styles?.button },
    };

    /** LOAD FORM */
    const load = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/forms/${id}`);
            if (response.status === 404) {
                setForm({ id: id!, title: "Form Not Found", description: "", styles: DEFAULT_STYLES });
                return;
            }

            const data = await response.json();
            setForm({
                id: data.form_id,
                title: data.title,
                description: data.description,
                styles: data.styles || DEFAULT_STYLES,
            });

            const normalizedFields = (data.fields || [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((f: any) => ({
                    id: f.field_id,
                    field_type: f.type,
                    label: f.label,
                    placeholder: f.placeholder,
                    required: f.required,
                    options: Array.isArray(f.options) ? f.options : null,
                    position: f.position,
                    width: f.width || 'full',
                }));

            setFields(normalizedFields);

            // Initialize formData
            const initialFormData: Record<string, string | boolean> = {};
            normalizedFields.forEach((f: FormField) => {
                if (f.field_type === "checkbox") initialFormData[f.id] = false;
                else initialFormData[f.id] = "";
            });
            setFormData(initialFormData);

        } catch (error) {
            console.error("Error loading form:", error);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    /** HANDLE INPUT CHANGE */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        const checked = target.checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /** GENERATE EMAIL-FRIENDLY HTML TEMPLATE */
    const generateReadOnlyHtml = (): string => {
        // Generate email-optimized HTML (works in Gmail, Outlook, etc.)
        let fieldsHtml = "";

        fields.forEach(field => {
            const value = formData[field.id];
            let displayValue = '';

            switch (field.field_type) {
                case "heading":
                    fieldsHtml += `
                        <tr>
                            <td colspan="2" style="padding: 24px 0 12px 0;">
                                <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: ${styles.title.color}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                    ${field.label}
                                </h3>
                            </td>
                        </tr>
                    `;
                    break;

                case "checkbox":
                    const isChecked = value as boolean;
                    displayValue = isChecked
                        ? `<span style="color: #10b981; font-weight: 600;">☑ Yes</span>`
                        : `<span style="color: #6b7280;">☐ No</span>`;

                    fieldsHtml += `
                        <tr>
                            <td style="padding: 12px 0; vertical-align: top; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <strong style="color: ${styles.fields.labelColor}; font-size: ${styles.fields.labelFontSize}; font-weight: ${styles.fields.labelFontWeight};">
                                    ${field.label}
                                </strong>
                            </td>
                            <td style="padding: 12px 0; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <div style="color: #111827; font-size: ${styles.fields.inputFontSize};">
                                    ${displayValue}
                                </div>
                            </td>
                        </tr>
                    `;
                    break;

                case "select":
                    const selectedOption = (field.options || []).find(opt => opt.value === value);
                    displayValue = selectedOption?.label || (value as string) || `<span style="color: #9ca3af; font-style: italic;">Not selected</span>`;

                    fieldsHtml += `
                        <tr>
                            <td style="padding: 12px 0; vertical-align: top; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <strong style="color: ${styles.fields.labelColor}; font-size: ${styles.fields.labelFontSize}; font-weight: ${styles.fields.labelFontWeight};">
                                    ${field.label}${field.required ? '<span style="color: #ef4444;"> *</span>' : ''}
                                </strong>
                            </td>
                            <td style="padding: 12px 0; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <div style="background-color: ${styles.fields.inputBackgroundColor}; border: 1px solid ${styles.fields.inputBorderColor}; border-radius: ${styles.fields.inputBorderRadius}; padding: ${styles.fields.inputPadding}; color: #111827; font-size: ${styles.fields.inputFontSize};">
                                    ${displayValue}
                                </div>
                            </td>
                        </tr>
                    `;
                    break;

                case "textarea":
                    displayValue = value
                        ? String(value).replace(/\n/g, '<br>')
                        : `<span style="color: #9ca3af; font-style: italic;">Empty</span>`;

                    fieldsHtml += `
                        <tr>
                            <td style="padding: 12px 0; vertical-align: top; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <strong style="color: ${styles.fields.labelColor}; font-size: ${styles.fields.labelFontSize}; font-weight: ${styles.fields.labelFontWeight};">
                                    ${field.label}${field.required ? '<span style="color: #ef4444;"> *</span>' : ''}
                                </strong>
                            </td>
                            <td style="padding: 12px 0; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <div style="background-color: ${styles.fields.inputBackgroundColor}; border: 1px solid ${styles.fields.inputBorderColor}; border-radius: ${styles.fields.inputBorderRadius}; padding: ${styles.fields.inputPadding}; color: #111827; font-size: ${styles.fields.inputFontSize}; white-space: pre-wrap; word-break: break-word;">
                                    ${displayValue}
                                </div>
                            </td>
                        </tr>
                    `;
                    break;

                case "signature":
                    displayValue = value
                        ? `<div style="font-style: italic; color: #111827;">${value}</div>`
                        : `<span style="color: #9ca3af; font-style: italic;">Not signed</span>`;

                    fieldsHtml += `
                        <tr>
                            <td style="padding: 12px 0; vertical-align: top; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <strong style="color: ${styles.fields.labelColor}; font-size: ${styles.fields.labelFontSize}; font-weight: ${styles.fields.labelFontWeight};">
                                    ${field.label}${field.required ? '<span style="color: #ef4444;"> *</span>' : ''}
                                </strong>
                            </td>
                            <td style="padding: 12px 0; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <div style="border: 2px dashed ${styles.fields.inputBorderColor}; border-radius: ${styles.fields.inputBorderRadius}; padding: ${styles.fields.inputPadding}; min-height: 80px; display: flex; align-items: center; justify-content: center; background-color: ${styles.fields.inputBackgroundColor};">
                                    ${displayValue}
                                </div>
                            </td>
                        </tr>
                    `;
                    break;

                default: // text, email, phone, address, date
                    displayValue = value
                        ? String(value)
                        : `<span style="color: #9ca3af; font-style: italic;">Empty</span>`;

                    fieldsHtml += `
                        <tr>
                            <td style="padding: 12px 0; vertical-align: top; width: 35%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <strong style="color: ${styles.fields.labelColor}; font-size: ${styles.fields.labelFontSize}; font-weight: ${styles.fields.labelFontWeight};">
                                    ${field.label}${field.required ? '<span style="color: #ef4444;"> *</span>' : ''}
                                </strong>
                            </td>
                            <td style="padding: 12px 0; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                <div style="background-color: ${styles.fields.inputBackgroundColor}; border: 1px solid ${styles.fields.inputBorderColor}; border-radius: ${styles.fields.inputBorderRadius}; padding: ${styles.fields.inputPadding}; color: #111827; font-size: ${styles.fields.inputFontSize}; word-break: break-word;">
                                    ${displayValue}
                                </div>
                            </td>
                        </tr>
                    `;
                    break;
            }
        });

        const submittedDate = new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Form Submission - ${form?.title || 'Form'}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${styles.container.backgroundColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
    
    <!-- Wrapper Table for Email Clients -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${styles.container.backgroundColor};">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Main Content Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: ${styles.container.maxWidth}; width: 100%; background-color: ${styles.card.backgroundColor}; border-radius: ${styles.card.borderRadius}; box-shadow: ${styles.container.boxShadow}; overflow: hidden;">
                    
                    <!-- Success Badge -->
                    <tr>
                        <td style="padding: ${styles.card.padding}; padding-bottom: 0;">
                            <div style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                ✓ Form Submitted Successfully
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="padding: ${styles.card.padding}; padding-top: 20px; padding-bottom: 10px;">
                            <h1 style="margin: 0; font-size: ${styles.title.fontSize}; font-weight: ${styles.title.fontWeight}; color: ${styles.title.color}; text-align: ${styles.title.textAlign}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.2;">
                                ${form?.title || 'Form Submission'}
                            </h1>
                            ${form?.description ? `
                            <p style="margin: 8px 0 0 0; font-size: ${styles.description.fontSize}; color: ${styles.description.color}; text-align: ${styles.description.textAlign}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.5;">
                                ${form.description}
                            </p>
                            ` : ''}
                        </td>
                    </tr>
                    
                    <!-- Form Fields Table -->
                    <tr>
                        <td style="padding: 0 ${styles.card.padding};">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 2px solid ${styles.fields.inputBorderColor}; margin-top: 20px;">
                                ${fieldsHtml}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: ${styles.card.padding}; padding-top: 30px; border-top: 1px solid ${styles.fields.inputBorderColor};">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                        <p style="margin: 0; font-size: 13px; color: ${styles.description.color}; line-height: 1.5;">
                                            <strong>Submitted on:</strong><br>
                                            ${submittedDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
                <!-- End Main Content Container -->
                
            </td>
        </tr>
    </table>
    <!-- End Wrapper Table -->
    
</body>
</html>
    `.trim();
    };

    /** SUBMIT FORM */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("Submitting...");

        const htmlString = generateReadOnlyHtml();
        const payload = {
            form_id: form?.id,
            html: htmlString,
            data: formData,
            metadata: {
                numberOfFields: fields.length,
                formTitle: form?.title,
                formDescription: form?.description,
                submittedAt: new Date().toISOString(),
            },
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/forms/${id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Form submitted successfully!");
                // Reset form
                formRef.current?.reset();
                const resetData: Record<string, string | boolean> = {};
                fields.forEach(f => {
                    resetData[f.id] = f.field_type === "checkbox" ? false : "";
                });
                setFormData(resetData);
            } else {
                setMessage("❌ Error: " + (data.message || "Failed to submit"));
            }
        } catch (error) {
            setMessage("❌ Something went wrong! Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /** GET FIELD WIDTH CLASS */
    const getFieldWidthStyle = (width?: 'full' | 'half' | 'third'): React.CSSProperties => {
        switch (width) {
            case 'half':
                return { width: '48%', minWidth: '200px' };
            case 'third':
                return { width: '32%', minWidth: '150px' };
            default:
                return { width: '100%' };
        }
    };

    /** RENDER FIELDS */
    const renderField = (field: FormField) => {
        const fieldStyle: React.CSSProperties = {
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            ...getFieldWidthStyle(field.width),
        };

        const labelStyle: React.CSSProperties = {
            marginBottom: '6px',
            fontWeight: styles.fields.labelFontWeight,
            color: styles.fields.labelColor,
            fontSize: styles.fields.labelFontSize,
        };

        const inputStyle: React.CSSProperties = {
            padding: styles.fields.inputPadding,
            border: `1px solid ${styles.fields.inputBorderColor}`,
            backgroundColor: styles.fields.inputBackgroundColor,
            borderRadius: styles.fields.inputBorderRadius,
            fontSize: styles.fields.inputFontSize,
            outline: 'none',
        };

        switch (field.field_type) {
            case "heading":
                return (
                    <h3
                        key={field.id}
                        style={{
                            fontSize: '22px',
                            fontWeight: '600',
                            margin: '28px 0 10px',
                            color: styles.title.color,
                            width: '100%',
                        }}
                    >
                        {field.label}
                    </h3>
                );

            case "text":
            case "email":
            case "phone":
            case "address":
            case "date":
                return (
                    <div key={field.id} style={fieldStyle}>
                        <label style={labelStyle}>
                            {field.label}
                            {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <input
                            type={field.field_type === 'address' ? 'text' : field.field_type}
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            onChange={handleChange}
                            value={formData[field.id] as string || ""}
                            style={inputStyle}
                        />
                    </div>
                );

            case "textarea":
                return (
                    <div key={field.id} style={fieldStyle}>
                        <label style={labelStyle}>
                            {field.label}
                            {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <textarea
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            onChange={handleChange}
                            value={formData[field.id] as string || ""}
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                );

            case "checkbox":
                return (
                    <div
                        key={field.id}
                        style={{
                            ...fieldStyle,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <input
                            type="checkbox"
                            name={field.id}
                            required={field.required}
                            onChange={handleChange}
                            checked={formData[field.id] as boolean || false}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <label style={{ ...labelStyle, marginBottom: 0 }}>
                            {field.label}
                        </label>
                    </div>
                );

            case "select":
                return (
                    <div key={field.id} style={fieldStyle}>
                        <label style={labelStyle}>
                            {field.label}
                            {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <select
                            name={field.id}
                            required={field.required}
                            onChange={handleChange}
                            value={formData[field.id] as string || ""}
                            style={inputStyle}
                        >
                            <option value="">{field.placeholder || "Select an option"}</option>
                            {(field.options || []).map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "signature":
                return (
                    <div key={field.id} style={fieldStyle}>
                        <label style={labelStyle}>
                            {field.label}
                            {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                        </label>
                        <div
                            style={{
                                border: `2px dashed ${styles.fields.inputBorderColor}`,
                                borderRadius: styles.fields.inputBorderRadius,
                                height: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: styles.fields.labelColor,
                                backgroundColor: styles.fields.inputBackgroundColor,
                            }}
                        >
                            Signature Area (Not yet implemented)
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!form) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: DEFAULT_STYLES.container?.backgroundColor,
            }}>
                <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading form...</p>
            </div>
        );
    }

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: styles.button.padding,
        backgroundColor: styles.button.backgroundColor,
        color: styles.button.textColor,
        borderRadius: styles.button.borderRadius,
        border: 'none',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        fontSize: styles.button.fontSize,
        marginTop: '10px',
        fontWeight: styles.button.fontWeight,
        opacity: isSubmitting ? 0.6 : 1,
        transition: 'background-color 0.2s',
    };

    return (
        <div
            style={{
                background: styles.container.backgroundColor,
                minHeight: '100vh',
                padding: '40px 20px',
            }}
        >
            <div
                style={{
                    maxWidth: styles.container.maxWidth,
                    margin: '0 auto',
                    padding: styles.card.padding,
                    backgroundColor: styles.card.backgroundColor,
                    borderRadius: styles.card.borderRadius,
                    boxShadow: styles.container.boxShadow,
                }}
            >
                <h2
                    style={{
                        fontSize: styles.title.fontSize,
                        fontWeight: styles.title.fontWeight,
                        marginBottom: '4px',
                        color: styles.title.color,
                        textAlign: styles.title.textAlign as any,
                    }}
                >
                    {form.title}
                </h2>

                {form.description && (
                    <p
                        style={{
                            color: styles.description.color,
                            marginBottom: '24px',
                            fontSize: styles.description.fontSize,
                            textAlign: styles.description.textAlign as any,
                        }}
                    >
                        {form.description}
                    </p>
                )}

                <form ref={formRef} onSubmit={handleSubmit}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        justifyContent: 'space-between',
                    }}>
                        {fields.map(renderField)}
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) {
                                e.currentTarget.style.backgroundColor = styles.button.hoverBackgroundColor || styles.button.backgroundColor || '#ea580c';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = styles.button.backgroundColor || '#f97316';
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

                {message && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: message.includes('✅') ? '#d1fae5' : '#fee2e2',
                            color: message.includes('✅') ? '#065f46' : '#991b1b',
                            fontSize: '15px',
                            textAlign: 'center',
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicForm;