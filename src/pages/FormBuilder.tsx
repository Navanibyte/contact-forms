/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "./integration";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Trash2, GripVertical, Eye, Save, X, Type, Mail, AlignLeft, List, CheckSquare, Calendar, Phone, MapPin, PenTool, FileText, Share2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "../components/ui/switch";

interface FormField {
    id: string;
    field_type: string;
    label: string;
    placeholder: string | null;
    required: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any;
    position: number;
}

interface Form {
    id: string;
    title: string;
    description: string | null;
}

const FIELD_TYPES = [
    { value: "heading", label: "Heading", icon: Type },
    { value: "text", label: "Text Input", icon: FileText },
    { value: "email", label: "Email", icon: Mail },
    { value: "textarea", label: "Text Area", icon: AlignLeft },
    { value: "select", label: "Dropdown", icon: List },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "address", label: "Address", icon: MapPin },
    { value: "date", label: "Date Picker", icon: Calendar },
    { value: "signature", label: "Signature", icon: PenTool },
];

interface SortableFieldProps {
    field: FormField;
    onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
}

const SortableField = ({ field, onUpdate, onDelete }: SortableFieldProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDelete(field.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>

            <div className="space-y-2">
                <Label>Field Type</Label>
                <Select value={field.field_type} onValueChange={(value) => onUpdate(field.id, { field_type: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Label</Label>
                <Input value={field.label} onChange={(e) => onUpdate(field.id, { label: e.target.value })} />
            </div>

            {field.field_type !== "heading" && (
                <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                        value={field.placeholder || ""}
                        onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    />
                </div>
            )}

            {field.field_type !== "heading" && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => onUpdate(field.id, { required: !!checked })}
                    />
                    <Label>Required field</Label>
                </div>
            )}
        </div>
    );
};

const FormBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<Form | null>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [embedCode, setEmbedCode] = useState("");

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));


    const generateEmbedCode = () => {
        const code = `
            <!-- Contact Form Embed -->
            <iframe 
            src="${window.location.origin}/form/${id}"  
            style="width: 100%; height: 100vh; border: none;"
            allow="cross-origin-isolated; clipboard-read; clipboard-write"
            ></iframe>
        `;

        setEmbedCode(code.trim());
    };

    // useEffect(() => {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     supabase.auth.getSession().then(({ data: { session } }: any) => {
    //         if (!session) {
    //             navigate("/auth");
    //         } else {
    //             loadForm();
    //         }
    //     });
    // }, [id, navigate]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/auth");
            return;
        }

        loadForm();
    }, [id, navigate]);

    const loadForm = async () => {
        try {
            // const { data: formData, error: formError } = await supabase
            //     .from("forms")
            //     .select("*")
            //     .eq("id", id)
            //     .single();

            // if (formError) throw formError;
            // setForm(formData);

            // const { data: fieldsData, error: fieldsError } = await supabase
            //     .from("form_fields")
            //     .select("*")
            //     .eq("form_id", id)
            //     .order("position");

            // if (fieldsError) throw fieldsError;
            // setFields(fieldsData || []);
            setFields([])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to load form");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveForm = async () => {
        if (!form) return;

        try {
            // const { error } = await supabase
            //     .from("forms")
            //     .update({
            //         title: form.title,
            //         description: form.description,
            //     })
            //     .eq("id", id);

            // if (error) throw error;

            // generateEmbedCode()

            const payload = {
                title: form.title,
                description: form.description,
                embedded_code: embedCode,
                styles: {},
                fields: fields.map((f, index) => ({
                    label: f.label,
                    type: f.field_type,
                    required: f.required,
                    placeholder: f.placeholder,
                    field_order: index,
                    status: 1,
                    options: f.options
                }),),
            }

            const response = await fetch(`http://localhost:3000/forms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error("Failed to save form");
            }

            const data = await response.json();

            console.log("data:::", data)

            toast.success("Form saved successfully");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to save form");
        }
    };

    const handleAddField = async (fieldType: string) => {
        if (!id) return;

        try {
            const newPosition = fields.length;
            const fieldLabel = FIELD_TYPES.find(t => t.value === fieldType)?.label || "New Field";

            // const { data, error } = await supabase
            //     .from("form_fields")
            //     .insert({
            //         form_id: id,
            //         field_type: fieldType,
            //         label: fieldLabel,
            //         placeholder: fieldType === "heading" ? null : "",
            //         required: false,
            //         position: newPosition,
            //     })
            //     .select()
            //     .single();

            const data: any = {
                id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
                field_type: fieldType,
                label: fieldLabel,
                placeholder: fieldType === "heading" ? null : "",
                required: false,
                position: newPosition,
            }
            setFields([...fields, data]);
            toast.success("Field added");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to add field");
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) {
            // Dragged from sidebar to canvas
            if (active.id.toString().startsWith("field-type-")) {
                const fieldType = active.id.toString().replace("field-type-", "");
                await handleAddField(fieldType);
            }
            return;
        }

        if (active.id.toString().startsWith("field-type-")) {
            // Dragged from sidebar to canvas
            const fieldType = active.id.toString().replace("field-type-", "");
            await handleAddField(fieldType);
            return;
        }

        // Reordering existing fields
        if (active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);

            const newFields = arrayMove(fields, oldIndex, newIndex);
            setFields(newFields);

            // Update positions in database
            try {
                const updates = newFields.map((field, index) => ({
                    id: field.id,
                    position: index,
                }));

                for (const update of updates) {
                    await supabase.from("form_fields").update({ position: update.position }).eq("id", update.id);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error("Failed to update field order");
            }
        }
    };

    const handleUpdateField = async (fieldId: string, updates: Partial<FormField>) => {
        try {
            // const { error } = await supabase
            //     .from("form_fields")
            //     .update(updates)
            //     .eq("id", fieldId);

            // if (error) throw error;

            setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to update field");
        }
    };

    const handleDeleteField = async (fieldId: string) => {
        try {
            console.log("fieldId:::", fieldId)
            // const { error } = await supabase.from("form_fields").delete().eq("id", fieldId);
            // if (error) throw error;
            setFields(fields.filter(f => f.id !== fieldId));
            toast.success("Field deleted");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to delete field");
        }
    };

    const renderFieldPreview = (field: FormField) => {
        switch (field.field_type) {
            case "heading":
                return <h2 className="text-2xl font-bold">{field.label}</h2>;
            case "email":
            case "text":
            case "phone":
            case "address":
                return <Input placeholder={field.placeholder || ""} disabled />;
            case "textarea":
                return <Textarea placeholder={field.placeholder || ""} disabled />;
            case "select":
                return (
                    <Select disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                    </Select>
                );
            case "checkbox":
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox disabled />
                        <Label>{field.label}</Label>
                    </div>
                );
            case "date":
                return <Input type="date" disabled />;
            case "signature":
                return <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-muted-foreground">Signature Area</div>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="min-h-screen flex bg-background">
                {/* Sidebar */}
                <aside className="w-80 bg-card border-r flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Form Elements</h2>
                        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-2">
                            {FIELD_TYPES.map((fieldType) => (
                                <DraggableFieldType key={fieldType.value} fieldType={fieldType} />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <header className="border-b ">
                        <div className="px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="preview-toggle" className="text-sm">Preview Form</Label>
                                    <Switch id="preview-toggle" checked={showPreview} onCheckedChange={setShowPreview} />
                                </div>
                            </div>
                            <Button onClick={handleSaveForm} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-8">
                        {showPreview ? (
                            <div className="max-w-2xl mx-auto">
                                <Card className="shadow-medium">
                                    <CardContent className="p-8">
                                        <div className="space-y-6">

                                            <div className="flex  flex-col">
                                                <div className="flex justify-between ityems-center">
                                                    <h3 className="text-3xl font-bold mb-2">{form?.title}</h3>
                                                    <Button
                                                        className=" "
                                                        variant="outline"
                                                        onClick={() => {
                                                            generateEmbedCode();
                                                            setShowEmbedModal(true)
                                                        }
                                                        }
                                                    >
                                                        <Share2 />
                                                    </Button>
                                                </div>
                                                {form?.description && (
                                                    <p className="text-muted-foreground">{form.description}</p>
                                                )}
                                            </div>

                                            {fields.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-12">
                                                    No fields added yet
                                                </p>
                                            ) : (
                                                <div className="space-y-6">
                                                    {fields.map((field) => (
                                                        <div key={field.id} className="space-y-2">
                                                            {field.field_type !== "checkbox" && field.field_type !== "heading" && (
                                                                <Label>
                                                                    {field.label}
                                                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                                                </Label>
                                                            )}
                                                            {renderFieldPreview(field)}
                                                        </div>
                                                    ))}
                                                    <Button className="w-full mt-6" size="lg">Submit</Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                <Card className="shadow-medium mb-6">
                                    <CardHeader>
                                        <CardTitle>Form Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Form Title</Label>
                                            <Input
                                                value={form?.title || ""}
                                                onChange={(e) => setForm({ ...form!, title: e.target.value })}
                                                placeholder="Enter form title"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={form?.description || ""}
                                                onChange={(e) => setForm({ ...form!, description: e.target.value })}
                                                placeholder="Enter form description"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-medium">
                                    <CardHeader>
                                        <CardTitle>Form Fields</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {fields.length === 0 ? (
                                            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                                                <GripVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <p className="text-lg text-muted-foreground">
                                                    Drag your first field here from the left
                                                </p>
                                            </div>
                                        ) : (
                                            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                                <div className="space-y-4">
                                                    {fields.map((field) => (
                                                        <SortableField
                                                            key={field.id}
                                                            field={field}
                                                            onUpdate={handleUpdateField}
                                                            onDelete={handleDeleteField}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </main>
                </div>

                {showEmbedModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-card border shadow-lg rounded-lg p-6 w-[600px] space-y-4">
                            <h3 className="text-xl font-semibold">Embed This Form</h3>

                            <Textarea
                                className="w-full h-56"
                                value={embedCode}
                                readOnly
                            />

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowEmbedModal(false)}
                                >
                                    Close
                                </Button>

                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(embedCode);
                                        toast.success("Embed code copied!");
                                    }}
                                >
                                    Copy Code
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <DragOverlay>
                {activeId && activeId.toString().startsWith("field-type-") && (
                    <div className="bg-card border rounded-lg p-3 shadow-lg">
                        <div className="flex items-center gap-3">
                            {(() => {
                                const fieldType = FIELD_TYPES.find(
                                    (t) => t.value === activeId.toString().replace("field-type-", "")
                                );
                                const Icon = fieldType?.icon;
                                return (
                                    <>
                                        {Icon && <Icon className="h-5 w-5" />}
                                        <span className="font-medium">{fieldType?.label}</span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

const DraggableFieldType = ({ fieldType }: { fieldType: typeof FIELD_TYPES[0] }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: `field-type-${fieldType.value}`,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = fieldType.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center gap-3 p-3 bg-background hover:bg-accent rounded-lg cursor-grab active:cursor-grabbing transition-colors border"
        >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{fieldType.label}</span>
        </div>
    );
};

export default FormBuilder;