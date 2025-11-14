import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./integration";

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

    const load = async () => {
        const { data: formData } = await supabase
            .from("forms")
            .select("*")
            .eq("id", id)
            .single();

        const { data: fieldData } = await supabase
            .from("form_fields")
            .select("*")
            .eq("form_id", id)
            .order("position");

        setForm(formData as Form);
        setFields((fieldData as FormField[]) || []);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const renderField = (field: FormField) => {
        switch (field.field_type) {
            case "heading":
                return `
                    <h3 class="pf-heading">${field.label}</h3>
                `;

            case "text":
            case "email":
            case "phone":
                return `
                <div class="pf-field">
                    <label>${field.label}${field.required ? " *" : ""}</label>
                    <input
                        type="${field.field_type}"
                        name="${field.id}"
                        placeholder="${field.placeholder || ""}"
                        ${field.required ? "required" : ""}
                    />
                </div>`;

            case "textarea":
                return `
                <div class="pf-field">
                    <label>${field.label}${field.required ? " *" : ""}</label>
                    <textarea
                        name="${field.id}"
                        placeholder="${field.placeholder || ""}"
                        ${field.required ? "required" : ""}
                    ></textarea>
                </div>`;

            case "checkbox":
                return `
                <div class="pf-field pf-checkbox-row">
                    <input type="checkbox" name="${field.id}" ${field.required ? "required" : ""}/>
                    <label>${field.label}</label>
                </div>`;

            case "select":
                return `
                <div class="pf-field">
                    <label>${field.label}${field.required ? " *" : ""}</label>
                    <select name="${field.id}" ${field.required ? "required" : ""}>
                        ${(field.options || []).map((o) => `<option>${o}</option>`).join("")}
                    </select>
                </div>`;

            case "date":
                return `
                <div class="pf-field">
                    <label>${field.label}${field.required ? " *" : ""}</label>
                    <input type="date" name="${field.id}" ${field.required ? "required" : ""}/>
                </div>`;

            default:
                return "";
        }
    };

    if (!form) return <p>Loading...</p>;

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `
<style>
    body {
        background: #f8f9fc;
    }

    .pf-container {
        max-width: 650px;
        margin: 40px auto;
        padding: 32px;
        background: #ffffff;
        border-radius: 18px;
        font-family: Inter, sans-serif;
        box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    }

    .pf-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 4px;
        color: #1f2937;
    }

    .pf-desc {
        color: #6b7280;
        margin-bottom: 24px;
        font-size: 15px;
    }

    .pf-heading {
        font-size: 22px;
        font-weight: 600;
        margin: 28px 0 10px;
        color: #1f2937;
    }

    .pf-field {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
    }

    .pf-field label {
        margin-bottom: 6px;
        font-weight: 500;
        color: #374151;
    }

    .pf-field input,
    .pf-field textarea,
    .pf-field select {
        padding: 12px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        border-radius: 10px;
        font-size: 15px;
    }

    .pf-field textarea {
        height: 100px;
        resize: vertical;
    }

    .pf-checkbox-row {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .pf-submit {
        width: 100%;
        padding: 14px;
        background: #f97316;
        color: white;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        font-size: 17px;
        margin-top: 10px;
        font-weight: 600;
    }

    .pf-submit:hover {
        background: #ea580c;
    }
</style>

<div class="pf-container">
    <div class="pf-title">${form.title}</div>
    <div class="pf-desc">${form.description || ""}</div>

    <form action="${window.location.origin}/submit/${id}" method="POST">
        ${fields.map(renderField).join("")}
        <button class="pf-submit" type="submit">Submit</button>
    </form>
</div>
`,
            }}
        />
    );
};

export default PublicForm;
