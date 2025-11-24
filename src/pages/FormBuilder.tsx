/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { supabase } from "./integration";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { toast } from "sonner";
// import { ArrowLeft, Trash2, GripVertical, Eye, Save, X, Type, Mail, AlignLeft, List, CheckSquare, Calendar, Phone, MapPin, PenTool, FileText, Share2 } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Checkbox } from "../components/ui/checkbox";
// import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
// import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Switch } from "../components/ui/switch";

// interface FormField {
//     id: string;
//     field_type: string;
//     label: string;
//     placeholder: string | null;
//     required: boolean;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     options: any;
//     position: number;
// }

// interface Form {
//     id: string;
//     title: string;
//     description: string | null;
// }

// const FIELD_TYPES = [
//     { value: "heading", label: "Heading", icon: Type },
//     { value: "text", label: "Text Input", icon: FileText },
//     { value: "email", label: "Email", icon: Mail },
//     { value: "textarea", label: "Text Area", icon: AlignLeft },
//     { value: "select", label: "Dropdown", icon: List },
//     { value: "checkbox", label: "Checkbox", icon: CheckSquare },
//     { value: "phone", label: "Phone", icon: Phone },
//     { value: "address", label: "Address", icon: MapPin },
//     { value: "date", label: "Date Picker", icon: Calendar },
//     { value: "signature", label: "Signature", icon: PenTool },
// ];

// interface SortableFieldProps {
//     field: FormField;
//     onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
//     onDelete: (fieldId: string) => void;
// }

// const SortableField = ({ field, onUpdate, onDelete }: SortableFieldProps) => {
//     const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//         opacity: isDragging ? 0.5 : 1,
//     };

//     return (
//         <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 space-y-3">
//             <div className="flex items-center justify-between">
//                 <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
//                     <GripVertical className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => onDelete(field.id)}>
//                     <Trash2 className="h-4 w-4 text-destructive" />
//                 </Button>
//             </div>

//             <div className="space-y-2">
//                 <Label>Field Type</Label>
//                 <Select value={field.field_type} onValueChange={(value) => onUpdate(field.id, { field_type: value })}>
//                     <SelectTrigger>
//                         <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {FIELD_TYPES.map((type) => (
//                             <SelectItem key={type.value} value={type.value}>
//                                 {type.label}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>

//             <div className="space-y-2">
//                 <Label>Label</Label>
//                 <Input value={field.label} onChange={(e) => onUpdate(field.id, { label: e.target.value })} />
//             </div>

//             {field.field_type !== "heading" && (
//                 <div className="space-y-2">
//                     <Label>Placeholder</Label>
//                     <Input
//                         value={field.placeholder || ""}
//                         onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
//                     />
//                 </div>
//             )}

//             {field.field_type !== "heading" && (
//                 <div className="flex items-center space-x-2">
//                     <Checkbox
//                         checked={field.required}
//                         onCheckedChange={(checked) => onUpdate(field.id, { required: !!checked })}
//                     />
//                     <Label>Required field</Label>
//                 </div>
//             )}
//         </div>
//     );
// };

// const FormBuilder = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [form, setForm] = useState<Form | null>(null);
//     const [fields, setFields] = useState<FormField[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [activeId, setActiveId] = useState<string | null>(null);
//     const [showPreview, setShowPreview] = useState(false);

//     const [showEmbedModal, setShowEmbedModal] = useState(false);
//     const [embedCode, setEmbedCode] = useState("");

//     const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));


//     const generateEmbedCode = () => {
//         const code = `
//             <!-- Contact Form Embed -->
//             <iframe 
//             src="${window.location.origin}/form/${id}"  
//             style="width: 100%; height: 100vh; border: none;"
//             allow="cross-origin-isolated; clipboard-read; clipboard-write"
//             ></iframe>
//         `;

//         setEmbedCode(code.trim());
//     };

//     // useEffect(() => {
//     //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     //     supabase.auth.getSession().then(({ data: { session } }: any) => {
//     //         if (!session) {
//     //             navigate("/auth");
//     //         } else {
//     //             loadForm();
//     //         }
//     //     });
//     // }, [id, navigate]);

//     useEffect(() => {
//         const token = sessionStorage.getItem("token");

//         if (!token) {
//             navigate("/auth");
//             return;
//         }

//         loadForm();
//     }, [id, navigate]);

//     const loadForm = async () => {
//         try {
//             setLoading(true);

//             const token = sessionStorage.getItem("token");

//             const response = await fetch(`http://localhost:3000/forms/${id}`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             });

//             // -------------------------------
//             // CASE 1: Form doesn't exist → Create Mode
//             // -------------------------------
//             if (response.status === 404) {
//                 setForm({
//                     id: "",
//                     title: "",
//                     description: ""
//                 });
//                 setFields([]);
//                 // setIsEditing(false);
//                 return;
//             }

//             // -------------------------------
//             // CASE 2: Other errors
//             // -------------------------------
//             if (!response.ok) {
//                 throw new Error("Failed to fetch form");
//             }

//             // -------------------------------
//             // CASE 3: Form exists → Edit Mode
//             // -------------------------------
//             const data = await response.json();

//             setForm({
//                 id: data.form_id,
//                 title: data.title,
//                 description: data.description,
//             });

//             setFields(
//                 (data.fields || [])
//                     .sort((a: any, b: any) => a.position - b.position)
//                     .map((f: any) => ({
//                         id: f.field_id,
//                         field_type: f.type,
//                         label: f.label,
//                         placeholder: f.placeholder,
//                         required: f.required,
//                         options: f.options,
//                         position: f.position,
//                     }))
//             );

//             // setIsEditing(true);

//         } catch (error: any) {
//             toast.error(error.message || "Error loading form");
//             navigate("/dashboard");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleSaveForm = async () => {
//         if (!form) return;

//         try {
//             // const { error } = await supabase
//             //     .from("forms")
//             //     .update({
//             //         title: form.title,
//             //         description: form.description,
//             //     })
//             //     .eq("id", id);

//             // if (error) throw error;

//             // generateEmbedCode()

//             const payload = {
//                 title: form.title,
//                 description: form.description,
//                 embedded_code: embedCode,
//                 styles: {},
//                 fields: fields.map((f, index) => ({
//                     label: f.label,
//                     type: f.field_type,
//                     required: f.required,
//                     placeholder: f.placeholder,
//                     field_order: index,
//                     status: 1,
//                     options: f.options
//                 }),),
//             }

//             const response = await fetch(`http://localhost:3000/forms/${id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${sessionStorage.getItem("token")}`
//                 },
//                 body: JSON.stringify(payload),
//             })

//             if (!response.ok) {
//                 throw new Error("Failed to save form");
//             }

//             const data = await response.json();

//             console.log("data:::", data)

//             toast.success("Form saved successfully");
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             toast.error(error.message || "Failed to save form");
//         }
//     };

//     const handleAddField = async (fieldType: string) => {
//         if (!id) return;

//         try {
//             const newPosition = fields.length;
//             const fieldLabel = FIELD_TYPES.find(t => t.value === fieldType)?.label || "New Field";

//             // const { data, error } = await supabase
//             //     .from("form_fields")
//             //     .insert({
//             //         form_id: id,
//             //         field_type: fieldType,
//             //         label: fieldLabel,
//             //         placeholder: fieldType === "heading" ? null : "",
//             //         required: false,
//             //         position: newPosition,
//             //     })
//             //     .select()
//             //     .single();

//             const data: any = {
//                 id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
//                 field_type: fieldType,
//                 label: fieldLabel,
//                 placeholder: fieldType === "heading" ? null : "",
//                 required: false,
//                 position: newPosition,
//             }
//             setFields([...fields, data]);
//             toast.success("Field added");
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             toast.error(error.message || "Failed to add field");
//         }
//     };

//     const handleDragStart = (event: DragStartEvent) => {
//         setActiveId(event.active.id as string);
//     };

//     const handleDragEnd = async (event: DragEndEvent) => {
//         const { active, over } = event;
//         setActiveId(null);

//         if (!over) {
//             // Dragged from sidebar to canvas
//             if (active.id.toString().startsWith("field-type-")) {
//                 const fieldType = active.id.toString().replace("field-type-", "");
//                 await handleAddField(fieldType);
//             }
//             return;
//         }

//         if (active.id.toString().startsWith("field-type-")) {
//             // Dragged from sidebar to canvas
//             const fieldType = active.id.toString().replace("field-type-", "");
//             await handleAddField(fieldType);
//             return;
//         }

//         // Reordering existing fields
//         if (active.id !== over.id) {
//             const oldIndex = fields.findIndex((f) => f.id === active.id);
//             const newIndex = fields.findIndex((f) => f.id === over.id);

//             const newFields = arrayMove(fields, oldIndex, newIndex);
//             setFields(newFields);

//             // Update positions in database
//             try {
//                 const updates = newFields.map((field, index) => ({
//                     id: field.id,
//                     position: index,
//                 }));

//                 for (const update of updates) {
//                     await supabase.from("form_fields").update({ position: update.position }).eq("id", update.id);
//                 }
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             } catch (error: any) {
//                 toast.error("Failed to update field order");
//             }
//         }
//     };

//     const handleUpdateField = async (fieldId: string, updates: Partial<FormField>) => {
//         try {
//             // const { error } = await supabase
//             //     .from("form_fields")
//             //     .update(updates)
//             //     .eq("id", fieldId);

//             // if (error) throw error;

//             setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             toast.error(error.message || "Failed to update field");
//         }
//     };

//     const handleDeleteField = async (fieldId: string) => {
//         try {
//             console.log("fieldId:::", fieldId)
//             // const { error } = await supabase.from("form_fields").delete().eq("id", fieldId);
//             // if (error) throw error;
//             setFields(fields.filter(f => f.id !== fieldId));
//             toast.success("Field deleted");
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             toast.error(error.message || "Failed to delete field");
//         }
//     };

//     const renderFieldPreview = (field: FormField) => {
//         switch (field.field_type) {
//             case "heading":
//                 return <h2 className="text-2xl font-bold">{field.label}</h2>;
//             case "email":
//             case "text":
//             case "phone":
//             case "address":
//                 return <Input placeholder={field.placeholder || ""} disabled />;
//             case "textarea":
//                 return <Textarea placeholder={field.placeholder || ""} disabled />;
//             case "select":
//                 return (
//                     <Select disabled>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Select an option" />
//                         </SelectTrigger>
//                     </Select>
//                 );
//             case "checkbox":
//                 return (
//                     <div className="flex items-center space-x-2">
//                         <Checkbox disabled />
//                         <Label>{field.label}</Label>
//                     </div>
//                 );
//             case "date":
//                 return <Input type="date" disabled />;
//             case "signature":
//                 return <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-muted-foreground">Signature Area</div>;
//             default:
//                 return null;
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p className="text-muted-foreground">Loading...</p>
//             </div>
//         );
//     }

//     return (
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//             <div className="min-h-screen flex bg-background">
//                 {/* Sidebar */}
//                 <aside className="w-80 bg-card border-r flex flex-col">
//                     <div className="p-4 border-b flex items-center justify-between">
//                         <h2 className="text-lg font-semibold">Form Elements</h2>
//                         <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
//                             <X className="h-4 w-4" />
//                         </Button>
//                     </div>

//                     <div className="flex-1 overflow-y-auto p-4">
//                         <div className="space-y-2">
//                             {FIELD_TYPES.map((fieldType) => (
//                                 <DraggableFieldType key={fieldType.value} fieldType={fieldType} />
//                             ))}
//                         </div>
//                     </div>
//                 </aside>

//                 {/* Main Content */}
//                 <div className="flex-1 flex flex-col">
//                     <header className="border-b ">
//                         <div className="px-6 py-3 flex items-center justify-between">
//                             <div className="flex items-center gap-6">
//                                 <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm">
//                                     <ArrowLeft className="h-4 w-4 mr-2" />
//                                     Back
//                                 </Button>
//                                 <div className="flex items-center gap-2">
//                                     <Label htmlFor="preview-toggle" className="text-sm">Preview Form</Label>
//                                     <Switch id="preview-toggle" checked={showPreview} onCheckedChange={setShowPreview} />
//                                 </div>
//                             </div>
//                             <Button onClick={handleSaveForm} size="sm">
//                                 <Save className="h-4 w-4 mr-2" />
//                                 Save
//                             </Button>
//                         </div>
//                     </header>

//                     <main className="flex-1 overflow-y-auto p-8">
//                         {showPreview ? (
//                             <div className="max-w-2xl mx-auto">
//                                 <Card className="shadow-medium">
//                                     <CardContent className="p-8">
//                                         <div className="space-y-6">

//                                             <div className="flex  flex-col">
//                                                 <div className="flex justify-between ityems-center">
//                                                     <h3 className="text-3xl font-bold mb-2">{form?.title}</h3>
//                                                     <Button
//                                                         className=" "
//                                                         variant="outline"
//                                                         onClick={() => {
//                                                             generateEmbedCode();
//                                                             setShowEmbedModal(true)
//                                                         }
//                                                         }
//                                                     >
//                                                         <Share2 />
//                                                     </Button>
//                                                 </div>
//                                                 {form?.description && (
//                                                     <p className="text-muted-foreground">{form.description}</p>
//                                                 )}
//                                             </div>

//                                             {fields.length === 0 ? (
//                                                 <p className="text-center text-muted-foreground py-12">
//                                                     No fields added yet
//                                                 </p>
//                                             ) : (
//                                                 <div className="space-y-6">
//                                                     {fields.map((field) => (
//                                                         <div key={field.id} className="space-y-2">
//                                                             {field.field_type !== "checkbox" && field.field_type !== "heading" && (
//                                                                 <Label>
//                                                                     {field.label}
//                                                                     {field.required && <span className="text-destructive ml-1">*</span>}
//                                                                 </Label>
//                                                             )}
//                                                             {renderFieldPreview(field)}
//                                                         </div>
//                                                     ))}
//                                                     <Button className="w-full mt-6" size="lg">Submit</Button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         ) : (
//                             <div className="max-w-4xl mx-auto">
//                                 <Card className="shadow-medium mb-6">
//                                     <CardHeader>
//                                         <CardTitle>Form Settings</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="space-y-2">
//                                             <Label>Form Title</Label>
//                                             <Input
//                                                 value={form?.title || ""}
//                                                 onChange={(e) => setForm({ ...form!, title: e.target.value })}
//                                                 placeholder="Enter form title"
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label>Description</Label>
//                                             <Textarea
//                                                 value={form?.description || ""}
//                                                 onChange={(e) => setForm({ ...form!, description: e.target.value })}
//                                                 placeholder="Enter form description"
//                                             />
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 <Card className="shadow-medium">
//                                     <CardHeader>
//                                         <CardTitle>Form Fields</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         {fields.length === 0 ? (
//                                             <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
//                                                 <GripVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                                                 <p className="text-lg text-muted-foreground">
//                                                     Drag your first field here from the left
//                                                 </p>
//                                             </div>
//                                         ) : (
//                                             <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
//                                                 <div className="space-y-4">
//                                                     {fields.map((field) => (
//                                                         <SortableField
//                                                             key={field.id}
//                                                             field={field}
//                                                             onUpdate={handleUpdateField}
//                                                             onDelete={handleDeleteField}
//                                                         />
//                                                     ))}
//                                                 </div>
//                                             </SortableContext>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         )}
//                     </main>
//                 </div>

//                 {showEmbedModal && (
//                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                         <div className="bg-card border shadow-lg rounded-lg p-6 w-[600px] space-y-4">
//                             <h3 className="text-xl font-semibold">Embed This Form</h3>

//                             <Textarea
//                                 className="w-full h-56"
//                                 value={embedCode}
//                                 readOnly
//                             />

//                             <div className="flex justify-end gap-3">
//                                 <Button
//                                     variant="secondary"
//                                     onClick={() => setShowEmbedModal(false)}
//                                 >
//                                     Close
//                                 </Button>

//                                 <Button
//                                     onClick={() => {
//                                         navigator.clipboard.writeText(embedCode);
//                                         toast.success("Embed code copied!");
//                                     }}
//                                 >
//                                     Copy Code
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 )}


//             </div>

//             <DragOverlay>
//                 {activeId && activeId.toString().startsWith("field-type-") && (
//                     <div className="bg-card border rounded-lg p-3 shadow-lg">
//                         <div className="flex items-center gap-3">
//                             {(() => {
//                                 const fieldType = FIELD_TYPES.find(
//                                     (t) => t.value === activeId.toString().replace("field-type-", "")
//                                 );
//                                 const Icon = fieldType?.icon;
//                                 return (
//                                     <>
//                                         {Icon && <Icon className="h-5 w-5" />}
//                                         <span className="font-medium">{fieldType?.label}</span>
//                                     </>
//                                 );
//                             })()}
//                         </div>
//                     </div>
//                 )}
//             </DragOverlay>
//         </DndContext>
//     );
// };

// const DraggableFieldType = ({ fieldType }: { fieldType: typeof FIELD_TYPES[0] }) => {
//     const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
//         id: `field-type-${fieldType.value}`,
//     });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         opacity: isDragging ? 0.5 : 1,
//     };

//     const Icon = fieldType.icon;

//     return (
//         <div
//             ref={setNodeRef}
//             style={style}
//             {...attributes}
//             {...listeners}
//             className="flex items-center gap-3 p-3 bg-background hover:bg-accent rounded-lg cursor-grab active:cursor-grabbing transition-colors border"
//         >
//             <Icon className="h-5 w-5 text-muted-foreground" />
//             <span className="font-medium">{fieldType.label}</span>
//         </div>
//     );
// };

// export default FormBuilder;


import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import {
    ArrowLeft, Trash2, GripVertical, Save, X, Type, Mail,
    AlignLeft, List, CheckSquare, Calendar, Phone, MapPin,
    PenTool, FileText, Share2, Plus, Copy, Palette, Settings
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import {
    DndContext, type DragEndEvent, DragOverlay, type DragStartEvent,
    closestCenter, PointerSensor, useSensor, useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FieldOption {
    id: string;
    label: string;
    value: string;
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
    styles?: {
        fontSize?: string;
        fontWeight?: string;
        textColor?: string;
        backgroundColor?: string;
        borderColor?: string;
        borderRadius?: string;
    };
}

interface FormStyles {
    container: {
        backgroundColor?: string;
        backgroundImage?: string;
        maxWidth?: string;
        padding?: string;
        borderRadius?: string;
        boxShadow?: string;
    };
    card: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: string;
        borderRadius?: string;
        padding?: string;
    };
    title: {
        fontSize?: string;
        fontWeight?: string;
        color?: string;
        textAlign?: string;
    };
    description: {
        fontSize?: string;
        color?: string;
        textAlign?: string;
    };
    fields: {
        labelColor?: string;
        labelFontSize?: string;
        labelFontWeight?: string;
        inputBackgroundColor?: string;
        inputBorderColor?: string;
        inputBorderRadius?: string;
        inputPadding?: string;
        inputFontSize?: string;
    };
    button: {
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        padding?: string;
        fontSize?: string;
        fontWeight?: string;
        hoverBackgroundColor?: string;
    };
}

interface Form {
    id: string;
    title: string;
    description: string | null;
    styles?: FormStyles;
}

interface FieldTypeConfig {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    hasOptions?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

const FIELD_TYPES: FieldTypeConfig[] = [
    { value: "heading", label: "Heading", icon: Type },
    { value: "text", label: "Text Input", icon: FileText },
    { value: "email", label: "Email", icon: Mail },
    { value: "textarea", label: "Text Area", icon: AlignLeft },
    { value: "select", label: "Dropdown", icon: List, hasOptions: true },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "address", label: "Address", icon: MapPin },
    { value: "date", label: "Date Picker", icon: Calendar },
    { value: "signature", label: "Signature", icon: PenTool },
];

const DEFAULT_STYLES: FormStyles = {
    container: {
        backgroundColor: '#ffffff',
        maxWidth: '800px',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    card: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: '1px',
        borderRadius: '8px',
        padding: '24px',
    },
    title: {
        fontSize: '30px',
        fontWeight: '700',
        color: '#111827',
        textAlign: 'left',
    },
    description: {
        fontSize: '16px',
        color: '#6b7280',
        textAlign: 'left',
    },
    fields: {
        labelColor: '#374151',
        labelFontSize: '14px',
        labelFontWeight: '500',
        inputBackgroundColor: '#ffffff',
        inputBorderColor: '#d1d5db',
        inputBorderRadius: '6px',
        inputPadding: '8px 12px',
        inputFontSize: '14px',
    },
    button: {
        backgroundColor: '#f97415',
        textColor: '#ffffff',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        hoverBackgroundColor: '#2563eb',
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateFieldId = (): string => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getAuthToken = (): string | null => {
    return sessionStorage.getItem("accessToken");
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface StylePanelProps {
    styles: FormStyles;
    onStylesChange: (styles: FormStyles) => void;
}

const StylePanel = ({ styles, onStylesChange }: StylePanelProps) => {
    // Ensure styles has all categories with defaults
    const safeStyles = {
        container: { ...DEFAULT_STYLES.container, ...styles?.container },
        card: { ...DEFAULT_STYLES.card, ...styles?.card },
        title: { ...DEFAULT_STYLES.title, ...styles?.title },
        description: { ...DEFAULT_STYLES.description, ...styles?.description },
        fields: { ...DEFAULT_STYLES.fields, ...styles?.fields },
        button: { ...DEFAULT_STYLES.button, ...styles?.button },
    };

    const updateStyles = (category: keyof FormStyles, property: string, value: string) => {
        onStylesChange({
            ...safeStyles,
            [category]: {
                ...safeStyles[category],
                [property]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="container" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="container">Container</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                </TabsList>

                {/* CONTAINER STYLES */}
                <TabsContent value="container" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={safeStyles.container.backgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles('container', 'backgroundColor', e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                value={safeStyles.container.backgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles('container', 'backgroundColor', e.target.value)}
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Max Width</Label>
                        <Select
                            value={safeStyles.container.maxWidth || '800px'}
                            onValueChange={(value) => updateStyles('container', 'maxWidth', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="600px">Small (600px)</SelectItem>
                                <SelectItem value="800px">Medium (800px)</SelectItem>
                                <SelectItem value="1000px">Large (1000px)</SelectItem>
                                <SelectItem value="100%">Full Width</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Border Radius</Label>
                        <Select
                            value={safeStyles.container.borderRadius || '12px'}
                            onValueChange={(value) => updateStyles('container', 'borderRadius', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0px">None</SelectItem>
                                <SelectItem value="6px">Small</SelectItem>
                                <SelectItem value="12px">Medium</SelectItem>
                                <SelectItem value="24px">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Padding</Label>
                        <Select
                            value={safeStyles.container.padding || '32px'}
                            onValueChange={(value) => updateStyles('container', 'padding', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="16px">Small</SelectItem>
                                <SelectItem value="32px">Medium</SelectItem>
                                <SelectItem value="48px">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Shadow</Label>
                        <Select
                            value={safeStyles.container.boxShadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)'}
                            onValueChange={(value) => updateStyles('container', 'boxShadow', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="0 1px 3px 0 rgb(0 0 0 / 0.1)">Small</SelectItem>
                                <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1)">Medium</SelectItem>
                                <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1)">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* CONTENT STYLES */}
                <TabsContent value="content" className="space-y-4">
                    <div className="border-b pb-4">
                        <h4 className="font-semibold mb-3">Title Styles</h4>

                        <div className="space-y-2 mb-3">
                            <Label>Title Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={safeStyles.title.color || '#111827'}
                                    onChange={(e) => updateStyles('title', 'color', e.target.value)}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={safeStyles.title.color || '#111827'}
                                    onChange={(e) => updateStyles('title', 'color', e.target.value)}
                                    placeholder="#111827"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-3">
                            <Label>Title Size</Label>
                            <Select
                                value={safeStyles.title.fontSize || '30px'}
                                onValueChange={(value) => updateStyles('title', 'fontSize', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24px">Small (24px)</SelectItem>
                                    <SelectItem value="30px">Medium (30px)</SelectItem>
                                    <SelectItem value="36px">Large (36px)</SelectItem>
                                    <SelectItem value="48px">X-Large (48px)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 mb-3">
                            <Label>Title Weight</Label>
                            <Select
                                value={safeStyles.title.fontWeight || '700'}
                                onValueChange={(value) => updateStyles('title', 'fontWeight', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="400">Normal</SelectItem>
                                    <SelectItem value="500">Medium</SelectItem>
                                    <SelectItem value="600">Semibold</SelectItem>
                                    <SelectItem value="700">Bold</SelectItem>
                                    <SelectItem value="800">Extra Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Title Alignment</Label>
                            <Select
                                value={safeStyles.title.textAlign || 'left'}
                                onValueChange={(value) => updateStyles('title', 'textAlign', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="font-semibold mb-3">Description Styles</h4>

                        <div className="space-y-2 mb-3">
                            <Label>Description Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={safeStyles.description.color || '#6b7280'}
                                    onChange={(e) => updateStyles('description', 'color', e.target.value)}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={safeStyles.description.color || '#6b7280'}
                                    onChange={(e) => updateStyles('description', 'color', e.target.value)}
                                    placeholder="#6b7280"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description Size</Label>
                            <Select
                                value={safeStyles.description.fontSize || '16px'}
                                onValueChange={(value) => updateStyles('description', 'fontSize', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="14px">Small (14px)</SelectItem>
                                    <SelectItem value="16px">Medium (16px)</SelectItem>
                                    <SelectItem value="18px">Large (18px)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Submit Button</h4>

                        <div className="space-y-2 mb-3">
                            <Label>Button Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={safeStyles.button.backgroundColor || '#f97415'}
                                    onChange={(e) => updateStyles('button', 'backgroundColor', e.target.value)}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={safeStyles.button.backgroundColor || '#f97415'}
                                    onChange={(e) => updateStyles('button', 'backgroundColor', e.target.value)}
                                    placeholder="#f97415"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-3">
                            <Label>Button Text Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={safeStyles.button.textColor || '#ffffff'}
                                    onChange={(e) => updateStyles('button', 'textColor', e.target.value)}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={safeStyles.button.textColor || '#ffffff'}
                                    onChange={(e) => updateStyles('button', 'textColor', e.target.value)}
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Button Size</Label>
                            <Select
                                value={safeStyles.button.padding || '12px 24px'}
                                onValueChange={(value) => updateStyles('button', 'padding', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="8px 16px">Small</SelectItem>
                                    <SelectItem value="12px 24px">Medium</SelectItem>
                                    <SelectItem value="16px 32px">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>

                {/* FIELDS STYLES */}
                <TabsContent value="fields" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Label Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={safeStyles.fields.labelColor || '#374151'}
                                onChange={(e) => updateStyles('fields', 'labelColor', e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                value={safeStyles.fields.labelColor || '#374151'}
                                onChange={(e) => updateStyles('fields', 'labelColor', e.target.value)}
                                placeholder="#374151"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Label Size</Label>
                        <Select
                            value={safeStyles.fields.labelFontSize || '14px'}
                            onValueChange={(value) => updateStyles('fields', 'labelFontSize', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12px">Small (12px)</SelectItem>
                                <SelectItem value="14px">Medium (14px)</SelectItem>
                                <SelectItem value="16px">Large (16px)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Input Background</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={safeStyles.fields.inputBackgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles('fields', 'inputBackgroundColor', e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                value={safeStyles.fields.inputBackgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles('fields', 'inputBackgroundColor', e.target.value)}
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Input Border Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={safeStyles.fields.inputBorderColor || '#d1d5db'}
                                onChange={(e) => updateStyles('fields', 'inputBorderColor', e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                value={safeStyles.fields.inputBorderColor || '#d1d5db'}
                                onChange={(e) => updateStyles('fields', 'inputBorderColor', e.target.value)}
                                placeholder="#d1d5db"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Input Border Radius</Label>
                        <Select
                            value={safeStyles.fields.inputBorderRadius || '6px'}
                            onValueChange={(value) => updateStyles('fields', 'inputBorderRadius', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0px">None</SelectItem>
                                <SelectItem value="4px">Small</SelectItem>
                                <SelectItem value="6px">Medium</SelectItem>
                                <SelectItem value="12px">Large</SelectItem>
                                <SelectItem value="9999px">Full</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Input Padding</Label>
                        <Select
                            value={safeStyles.fields.inputPadding || '8px 12px'}
                            onValueChange={(value) => updateStyles('fields', 'inputPadding', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6px 10px">Small</SelectItem>
                                <SelectItem value="8px 12px">Medium</SelectItem>
                                <SelectItem value="12px 16px">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="pt-4 border-t">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onStylesChange(DEFAULT_STYLES)}
                >
                    Reset to Default Styles
                </Button>
            </div>
        </div>
    );
};

interface SortableFieldProps {
    field: FormField;
    onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
    onDelete: (fieldId: string) => void;
    onDuplicate: (fieldId: string) => void;
}

const SortableField = ({ field, onUpdate, onDelete, onDuplicate }: SortableFieldProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: field.id });

    const fieldConfig = FIELD_TYPES.find(t => t.value === field.field_type);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleAddOption = () => {
        const newOption: FieldOption = {
            id: generateFieldId(),
            label: "New Option",
            value: "new_option"
        };
        const currentOptions = field.options || [];
        onUpdate(field.id, { options: [...currentOptions, newOption] });
    };

    const handleUpdateOption = (optionId: string, updates: Partial<FieldOption>) => {
        const updatedOptions = (field.options || []).map(opt =>
            opt.id === optionId ? { ...opt, ...updates } : opt
        );
        onUpdate(field.id, { options: updatedOptions });
    };

    const handleDeleteOption = (optionId: string) => {
        const updatedOptions = (field.options || []).filter(opt => opt.id !== optionId);
        onUpdate(field.id, { options: updatedOptions });
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {fieldConfig?.label}
                    </span>
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicate(field.id)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(field.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Field Type</Label>
                <Select
                    value={field.field_type}
                    onValueChange={(value) => onUpdate(field.id, { field_type: value })}
                >
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
                <Input
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                />
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

            {/* Field Width */}
            <div className="space-y-2">
                <Label>Field Width</Label>
                <Select
                    value={field.width || 'full'}
                    onValueChange={(value: 'full' | 'half' | 'third') => onUpdate(field.id, { width: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full">Full Width (100%)</SelectItem>
                        <SelectItem value="half">Half Width (50%)</SelectItem>
                        <SelectItem value="third">Third Width (33%)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Options for dropdown */}
            {fieldConfig?.hasOptions && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddOption}
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {(field.options || []).map((option) => (
                            <div key={option.id} className="flex gap-2">
                                <Input
                                    value={option.label}
                                    onChange={(e) => handleUpdateOption(option.id, { label: e.target.value })}
                                    placeholder="Label"
                                    className="flex-1"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteOption(option.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
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

const DraggableFieldType = ({ fieldType }: { fieldType: FieldTypeConfig }) => {
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
            className="flex items-center gap-3 p-3 bg-background hover:bg-primary rounded-lg cursor-grab active:cursor-grabbing transition-colors border"
        >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{fieldType.label}</span>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FormBuilder = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<Form | null>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [embedCode, setEmbedCode] = useState("");
    const [showStylePanel, setShowStylePanel] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    // ============================================================================
    // API CALLS
    // ============================================================================

    const loadForm = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const token = getAuthToken();

            if (!token) {
                navigate("/auth");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
                method: "GET",
                credentials: "include",   // 🔥 required for cookies / sessions

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 404) {
                setForm({
                    id: id,
                    title: "Untitled Form",
                    description: "",
                    styles: DEFAULT_STYLES,
                });
                setFields([]);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch form");
            }

            const data = await response.json();

            setForm({
                id: data.form_id || id,
                title: data.title || "Untitled Form",
                description: data.description || "",
                styles: data.styles || DEFAULT_STYLES,
            });

            const loadedFields: FormField[] = (data.fields || [])
                .sort((a: any, b: any) => a.position - b.position)
                .map((f: any) => ({
                    id: f.field_id || generateFieldId(),
                    field_type: f.type,
                    label: f.label,
                    placeholder: f.placeholder,
                    required: f.required || false,
                    options: f.options || null,
                    position: f.position,
                    width: f.width || 'full',
                    styles: f.styles || {},
                }));

            setFields(loadedFields);

        } catch (error) {
            toast.error("Error loading form");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    const handleSaveForm = async () => {
        if (!form || !id) return;

        try {
            setSaving(true);
            const token = getAuthToken();

            if (!token) {
                toast.error("Authentication required");
                navigate("/auth");
                return;
            }

            const payload = {
                title: form.title,
                description: form.description,
                embedded_code: embedCode,
                styles: form.styles,
                fields: fields.map((f, index) => ({
                    label: f.label,
                    type: f.field_type,
                    required: f.required,
                    placeholder: f.placeholder,
                    field_order: index,
                    status: 1,
                    options: f.options,
                    width: f.width,
                    styles: f.styles,
                })),
            };

            const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
                method: "PUT",
                credentials: "include",   // 🔥 required for cookies / sessions

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save form");
            }

            toast.success("Form saved successfully");
        } catch (error) {
            toast.error("Failed to save form");
        } finally {
            setSaving(false);
        }
    };

    // ============================================================================
    // FIELD OPERATIONS
    // ============================================================================

    const handleAddField = useCallback((fieldType: string) => {
        if (!id) return;

        const newPosition = fields.length;
        const fieldConfig = FIELD_TYPES.find(t => t.value === fieldType);
        const fieldLabel = fieldConfig?.label || "New Field";

        const newField: FormField = {
            id: generateFieldId(),
            field_type: fieldType,
            label: fieldLabel,
            placeholder: fieldType === "heading" ? null : `Enter ${fieldLabel.toLowerCase()}`,
            required: false,
            options: fieldConfig?.hasOptions ? [] : null,
            position: newPosition,
            width: 'full',
        };

        setFields([...fields, newField]);
        toast.success("Field added");
    }, [fields, id]);

    const handleUpdateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
        setFields(prevFields =>
            prevFields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        );
    }, []);

    const handleDeleteField = useCallback((fieldId: string) => {
        setFields(prevFields => prevFields.filter(f => f.id !== fieldId));
        toast.success("Field deleted");
    }, []);

    const handleDuplicateField = useCallback((fieldId: string) => {
        const fieldToDuplicate = fields.find(f => f.id === fieldId);
        if (!fieldToDuplicate) return;

        const newField: FormField = {
            ...fieldToDuplicate,
            id: generateFieldId(),
            label: `${fieldToDuplicate.label} (Copy)`,
            position: fields.length,
        };

        setFields([...fields, newField]);
        toast.success("Field duplicated");
    }, [fields]);

    // ============================================================================
    // DRAG AND DROP
    // ============================================================================

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) {
            if (active.id.toString().startsWith("field-type-")) {
                const fieldType = active.id.toString().replace("field-type-", "");
                handleAddField(fieldType);
            }
            return;
        }

        if (active.id.toString().startsWith("field-type-")) {
            const fieldType = active.id.toString().replace("field-type-", "");
            handleAddField(fieldType);
            return;
        }

        if (active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newFields = arrayMove(fields, oldIndex, newIndex).map((f, index) => ({
                    ...f,
                    position: index,
                }));
                setFields(newFields);
            }
        }
    };

    // ============================================================================
    // EMBED CODE
    // ============================================================================

    const generateEmbedCode = () => {
        const code = `<!-- Form Embed Code -->
<iframe 
  src="${window.location.origin}/form/${id}"  
  style="width: 100%; height: 100vh; border: none;"
  allow="cross-origin-isolated"
  title="Form"
></iframe>`;

        setEmbedCode(code.trim());
    };

    // ============================================================================
    // PREVIEW RENDERING
    // ============================================================================

    const getFieldWidthClass = (width?: 'full' | 'half' | 'third') => {
        switch (width) {
            case 'half': return 'md:w-[48%]';
            case 'third': return 'md:w-[32%]';
            default: return 'w-full';
        }
    };

    const renderFieldPreview = (field: FormField, formStyles: FormStyles) => {
        const inputStyle = {
            backgroundColor: formStyles.fields.inputBackgroundColor,
            borderColor: formStyles.fields.inputBorderColor,
            borderRadius: formStyles.fields.inputBorderRadius,
            padding: formStyles.fields.inputPadding,
            fontSize: formStyles.fields.inputFontSize,
        };

        const labelStyle = {
            color: formStyles.fields.labelColor,
            fontSize: formStyles.fields.labelFontSize,
            fontWeight: formStyles.fields.labelFontWeight,
        };

        switch (field.field_type) {
            case "heading":
                return <h2 className="text-2xl font-bold" style={{ color: formStyles.title.color }}>{field.label}</h2>;

            case "email":
            case "text":
            case "phone":
            case "address":
                return <input
                    placeholder={field.placeholder || ""}
                    disabled
                    className="w-full border"
                    style={inputStyle}
                />;

            case "textarea":
                return <textarea
                    placeholder={field.placeholder || ""}
                    disabled
                    rows={4}
                    className="w-full border resize-none"
                    style={inputStyle}
                />;

            case "select":
                return (
                    <select disabled className="w-full border" style={inputStyle}>
                        <option>{field.placeholder || "Select an option"}</option>
                        {(field.options || []).map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case "checkbox":
                return (
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" disabled className="h-4 w-4" />
                        <label style={labelStyle}>{field.label}</label>
                    </div>
                );

            case "date":
                return <input type="date" disabled className="w-full border" style={inputStyle} />;

            case "signature":
                return (
                    <div
                        className="border-2 border-dashed h-32 flex items-center justify-center"
                        style={{
                            borderColor: formStyles.fields.inputBorderColor,
                            borderRadius: formStyles.fields.inputBorderRadius,
                            color: formStyles.fields.labelColor
                        }}
                    >
                        Signature Area
                    </div>
                );

            default:
                return null;
        }
    };

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        loadForm();
    }, [loadForm]);

    // ============================================================================
    // RENDER
    // ============================================================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Loading form...</p>
                </div>
            </div>
        );
    }

    const formStyles = form?.styles ? (Object.keys(form.styles).length > 0 ? form.styles : DEFAULT_STYLES) : DEFAULT_STYLES

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen flex bg-background">
                {/* Sidebar - Fields or Styles */}
                <aside className="w-80 bg-card border-r flex flex-col">
                    <div className="p-4 border-b">
                        <div className="flex gap-2 mb-4">
                            <Button
                                variant={!showStylePanel ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setShowStylePanel(false)}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Fields
                            </Button>
                            <Button
                                variant={showStylePanel ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setShowStylePanel(true)}
                            >
                                <Palette className="h-4 w-4 mr-2" />
                                Styles
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {!showStylePanel ? (
                            <>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Drag fields to the canvas
                                </p>
                                <div className="space-y-2">
                                    {FIELD_TYPES.map((fieldType) => (
                                        <DraggableFieldType key={fieldType.value} fieldType={fieldType} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <StylePanel
                                styles={formStyles}
                                onStylesChange={(newStyles) => setForm({ ...form!, styles: newStyles })}
                            />
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <header className="border-b bg-card">
                        <div className="px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Button variant="ghost" onClick={() => navigate("/dashboard")} size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="preview-toggle" className="text-sm">Preview</Label>
                                    <Switch
                                        id="preview-toggle"
                                        checked={showPreview}
                                        onCheckedChange={setShowPreview}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveForm} disabled={saving} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : "Save Form"}
                            </Button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: formStyles.container?.backgroundColor }}>
                        {showPreview ? (
                            // PREVIEW MODE WITH STYLES
                            <div className="mx-auto" style={{ maxWidth: formStyles.container?.maxWidth }}>
                                <div
                                    className="shadow-lg"
                                    style={{
                                        backgroundColor: formStyles.card?.backgroundColor,
                                        borderRadius: formStyles.card?.borderRadius,
                                        padding: formStyles.card?.padding,
                                        borderWidth: formStyles.card?.borderWidth,
                                        borderColor: formStyles.card?.borderColor,
                                        borderStyle: 'solid',
                                    }}
                                >
                                    <div className="space-y-6">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3
                                                    className="font-bold"
                                                    style={{
                                                        fontSize: formStyles?.title?.fontSize,
                                                        fontWeight: formStyles?.title?.fontWeight,
                                                        color: formStyles?.title?.color,
                                                        textAlign: formStyles?.title?.textAlign as any,
                                                    }}
                                                >
                                                    {form?.title}
                                                </h3>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        generateEmbedCode();
                                                        setShowEmbedModal(true);
                                                    }}
                                                >
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Embed
                                                </Button>
                                            </div>
                                            {form?.description && (
                                                <p
                                                    style={{
                                                        fontSize: formStyles?.description?.fontSize,
                                                        color: formStyles?.description?.color,
                                                        textAlign: formStyles?.description?.textAlign as any,
                                                    }}
                                                >
                                                    {form.description}
                                                </p>
                                            )}
                                        </div>

                                        {fields.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                                <p className="text-muted-foreground">
                                                    No fields added yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-4">
                                                {fields.map((field) => (
                                                    <div
                                                        key={field.id}
                                                        className={`space-y-2 ${getFieldWidthClass(field.width)}`}
                                                    >
                                                        {field.field_type !== "checkbox" && field.field_type !== "heading" && (
                                                            <label
                                                                style={{
                                                                    color: formStyles.fields?.labelColor,
                                                                    fontSize: formStyles.fields?.labelFontSize,
                                                                    fontWeight: formStyles.fields?.labelFontWeight,
                                                                    display: 'block',
                                                                }}
                                                            >
                                                                {field.label}
                                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                                            </label>
                                                        )}
                                                        {renderFieldPreview(field, formStyles)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            className="w-full mt-6 font-semibold transition-colors"
                                            style={{
                                                backgroundColor: formStyles.button?.backgroundColor,
                                                color: formStyles.button?.textColor,
                                                borderRadius: formStyles.button?.borderRadius,
                                                padding: formStyles.button?.padding,
                                                fontSize: formStyles.button?.fontSize,
                                                fontWeight: formStyles.button?.fontWeight,
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = formStyles.button?.hoverBackgroundColor || formStyles.button?.backgroundColor || '#2563eb';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = formStyles.button?.backgroundColor || '#f97415';
                                            }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // EDIT MODE
                            <div className="max-w-4xl mx-auto">
                                <Card className="shadow-md mb-6">
                                    <CardHeader>
                                        <CardTitle>Form Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Form Title *</Label>
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
                                                placeholder="Enter form description (optional)"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Form Fields ({fields.length})</CardTitle>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowStylePanel(true)}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Customize Styles
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {fields.length === 0 ? (
                                            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                                                <GripVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <p className="text-lg text-muted-foreground mb-2">
                                                    Drag your first field here
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Or click on a field type from the left sidebar
                                                </p>
                                            </div>
                                        ) : (
                                            <SortableContext
                                                items={fields.map((f) => f.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-4">
                                                    {fields.map((field) => (
                                                        <SortableField
                                                            key={field.id}
                                                            field={field}
                                                            onUpdate={handleUpdateField}
                                                            onDelete={handleDeleteField}
                                                            onDuplicate={handleDuplicateField}
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

                {/* Embed Modal */}
                {showEmbedModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card border shadow-lg rounded-lg p-6 w-full max-w-2xl space-y-4">
                            <h3 className="text-xl font-semibold">Embed This Form</h3>
                            <p className="text-sm text-muted-foreground">
                                Copy this code and paste it into your website
                            </p>

                            <Textarea
                                className="w-full h-48 font-mono text-sm"
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

export default FormBuilder;