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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Form {
    id: string;
    title: string;
    description: string | null;
}

interface FormField {
    id: string;
    field_type: string;
    label: string;
    placeholder: string | null;
    required: boolean;
    options: string[] | null;
    position: number;
}

const PublicForm = () => {
    const { id } = useParams();
    const [form, setForm] = useState<Form | null>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [message, setMessage] = useState("");

    /** LOAD FORM */
    const load = async () => {
        try {
            const response = await fetch(`http://localhost:3000/forms/${id}`);

            if (response.status === 404) {
                setForm({ id: id!, title: "Form", description: "" });
                return;
            }

            const data = await response.json();

            setForm({
                id: data.form_id,
                title: data.title,
                description: data.description,
            });

            const normalizedFields = (data.fields || [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((f: any) => ({
                    id: f.field_id,
                    field_type: f.type,
                    label: f.label,
                    placeholder: f.placeholder,
                    required: f.required,
                    options: Array.isArray(f.options) ? f.options : [],
                    position: f.position,
                }));

            setFields(normalizedFields);
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
        const { name, value, type, checked } = e.target;

        console.log("name:", name, "value:", value, "type:", type, "checked:", checked);

        // Find the field object by id
        const field = fields.find(f => f.field_type.toLowerCase() === type.toLowerCase());

        console.log("field found:", field);

        if (!field) return;

        const key = field.label; // Use the label as key

        console.log("Updating key:", key);

        setFormData((prev: any) => ({
            ...prev,
            [key]: type === "checkbox" ? checked : value,
        }));
    };

    /** SUBMIT FORM */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("Submitting...");

        console.log("Form Data to submit:", formData);

        try {
            const res = await fetch(`http://localhost:3000/forms/${id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Form submitted successfully!");
            } else {
                setMessage("Error: " + data.message);
            }
        } catch (error) {
            setMessage("Something went wrong!");
        }
    };

    /** RENDER FIELDS */
    const renderField = (field: FormField) => {
        switch (field.field_type) {
            case "heading":
                return (
                    <h3 className="pf-heading" key={field.id}>
                        {field.label}
                    </h3>
                );

            case "text":
            case "email":
            case "phone":
                return (
                    <div className="pf-field" key={field.id}>
                        <label>
                            {field.label}
                            {field.required ? " *" : ""}
                        </label>
                        <input
                            type={field.field_type}
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            onChange={handleChange}
                        />
                    </div>
                );

            case "textarea":
                return (
                    <div className="pf-field" key={field.id}>
                        <label>
                            {field.label}
                            {field.required ? " *" : ""}
                        </label>
                        <textarea
                            name={field.id}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            onChange={handleChange}
                        />
                    </div>
                );

            case "checkbox":
                return (
                    <div className="pf-field pf-checkbox-row" key={field.id}>
                        <input
                            type="checkbox"
                            name={field.id}
                            required={field.required}
                            onChange={handleChange}
                        />
                        <label>{field.label}</label>
                    </div>
                );

            case "select":
                return (
                    <div className="pf-field" key={field.id}>
                        <label>
                            {field.label}
                            {field.required ? " *" : ""}
                        </label>
                        <select
                            name={field.id}
                            required={field.required}
                            onChange={handleChange}
                        >
                            {(field.options || []).map((o, i) => (
                                <option key={i}>{o}</option>
                            ))}
                        </select>
                    </div>
                );

            case "date":
                return (
                    <div className="pf-field" key={field.id}>
                        <label>
                            {field.label}
                            {field.required ? " *" : ""}
                        </label>
                        <input
                            type="date"
                            name={field.id}
                            required={field.required}
                            onChange={handleChange}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (!form) return <p>Loading...</p>;

    return (
        <>
            {/* ======= SAME STYLES YOU USED BEFORE ======= */}
            <style>
                {`
        body { background: #f8f9fc; }
        .pf-container {
          max-width: 650px;
          margin: 40px auto;
          padding: 32px;
          background: #ffffff;
          border-radius: 18px;
          font-family: Inter, sans-serif;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
        }
        .pf-title { font-size: 28px; font-weight: 700; margin-bottom: 4px; color: #1f2937; }
        .pf-desc { color: #6b7280; margin-bottom: 24px; font-size: 15px; }
        .pf-heading { font-size: 22px; font-weight: 600; margin: 28px 0 10px; color: #1f2937; }
        .pf-field { margin-bottom: 20px; display: flex; flex-direction: column; }
        .pf-field label { margin-bottom: 6px; font-weight: 500; color: #374151; }
        .pf-field input, .pf-field textarea, .pf-field select {
          padding: 12px; border: 1px solid #d1d5db; background: #f9fafb;
          border-radius: 10px; font-size: 15px;
        }
        .pf-field textarea { height: 100px; resize: vertical; }
        .pf-checkbox-row { display: flex; gap: 10px; align-items: center; }
        .pf-submit {
          width: 100%; padding: 14px; background: #f97316; color: white;
          border-radius: 10px; border: none; cursor: pointer; font-size: 17px;
          margin-top: 10px; font-weight: 600;
        }
        .pf-submit:hover { background: #ea580c; }
      `}
            </style>

            <div className="pf-container">
                <h2 className="pf-title">{form.title}</h2>
                <p className="pf-desc">{form.description || ""}</p>

                <form onSubmit={handleSubmit}>
                    {fields.map(renderField)}

                    <button type="submit" className="pf-submit">
                        Submit
                    </button>
                </form>

                {message && <p style={{ marginTop: 15, fontSize: 16 }}>{message}</p>}
            </div>
        </>
    );
};

export default PublicForm;
