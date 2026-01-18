"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Button,
  Radio,
  InputNumber,
  Upload,
  Steps,
  Select,
  Divider,
  Switch,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import type { SelectProps } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  createProperty,
  getPropertyList,
  resetCreateProperty,
  resetPropertyList,
  updateProperty,
  resetUpdateProperty,
  getPropertyTags,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";
import LeftImage from "../navbar/LeftImage";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const { TextArea } = Input;

type PropertyFormProps = {
  mode: "create" | "edit";
  initialValues?: any;
  onSuccess?: () => void;
};

type PropertyFormState = {
  category: string;
  title: string;
  description: string;

  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;

  price_per_night: number;
  weekly_discount_rate: number; // percent (0-100) in UI
  monthly_discount_rate: number; // percent (0-100) in UI
  cleaning_fee: number;

  is_instant_booking: boolean;
  location: string;

  tags: Array<string | number>;
  imageFile: File | null;

  // for Upload UI
  imageList: UploadFile[];
};

const steps = [
  { title: "" },
  { title: "" },
  { title: "" },
  { title: "" },
  { title: "" },
  { title: "" },
];

const defaultState: PropertyFormState = {
  category: "",
  title: "",
  description: "",

  guests: 1,
  bedrooms: 0,
  beds: 1,
  bathrooms: 1,

  price_per_night: 0,
  weekly_discount_rate: 0,
  monthly_discount_rate: 0,
  cleaning_fee: 0,

  is_instant_booking: false,
  location: "",

  tags: [],
  imageFile: null,
  imageList: [],
};

function getFileNameFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "image");
  } catch {
    return decodeURIComponent(url.split("/").pop() || "image");
  }
}

export default function PropertyForm({
  mode,
  initialValues,
  onSuccess,
}: PropertyFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<PropertyFormState>(defaultState);
  const [direction, setDirection] = useState(1);

  const { error, loading, success, message } = useAppSelector((s) =>
    mode === "create" ? s.property.createProperty : s.property.updateProperty,
  );

  const stepVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 18 : -18,
    }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -18 : 18,
    }),
  };

  const { data: propertyTagList, loading: propertyTagListLoading } =
    useAppSelector((s) => s.property.propertyTagList);

  useEffect(() => {
    dispatch(getPropertyTags());
  }, [dispatch]);

  const tagOptions: SelectProps["options"] = useMemo(() => {
    return (propertyTagList || []).map((t) => ({
      value: t.value,
      label: t.label,
    }));
  }, [propertyTagList]);

  // hydrate state in edit mode
  useEffect(() => {
    if (mode !== "edit" || !initialValues) return;

    const imageUrl = initialValues.image_url;
    const fileName = imageUrl
      ? getFileNameFromUrl(imageUrl)
      : "current-image.jpg";

    setState((prev) => ({
      ...prev,
      category: initialValues.category ?? "",
      title: initialValues.title ?? "",
      description: initialValues.description ?? "",

      guests: Number(initialValues.guests ?? 1),
      bedrooms: Number(initialValues.bedrooms ?? 0),
      beds: Number(initialValues.beds ?? 1),
      bathrooms: Number(initialValues.bathrooms ?? 1),

      price_per_night: Number(initialValues.price_per_night ?? 0),
      weekly_discount_rate: initialValues.weekly_discount_rate
        ? Number(initialValues.weekly_discount_rate) * 100
        : 0,
      monthly_discount_rate: initialValues.monthly_discount_rate
        ? Number(initialValues.monthly_discount_rate) * 100
        : 0,
      cleaning_fee: Number(initialValues.cleaning_fee ?? 0),

      is_instant_booking: Boolean(initialValues.is_instant_booking),
      location: initialValues.location ?? "",

      tags: (initialValues.tags ?? []).map((x: any) =>
        typeof x === "object" ? (x.id ?? x.value) : x,
      ),
      imageFile: null,

      imageList: imageUrl
        ? [
            {
              uid: "-1",
              name: fileName,
              status: "done",
              url: imageUrl,
              thumbUrl: imageUrl,
            },
          ]
        : [],
    }));
  }, [mode, initialValues]);

  useEffect(() => {
    if (success) {
      toast.success(
        mode === "create"
          ? "Property created successfully"
          : "Property updated successfully",
      );

      dispatch(resetUpdateProperty());
      dispatch(resetCreateProperty());
      dispatch(getPropertyList());
      dispatch(resetPropertyList());

      onSuccess?.();
    }

    if (error) toast.error(message);
    dispatch(resetCreateProperty());
  }, [success, error, message, mode, onSuccess, dispatch]);

  const setField = <K extends keyof PropertyFormState>(
    key: K,
    value: PropertyFormState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[String(key)];
      return next;
    });
  };

  // simple per-step validation
  const validateStep = (step: number) => {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!state.category) e.category = "Please select a category.";
    }

    if (step === 1) {
      if (!state.title.trim()) e.title = "Title is required.";
      if (!state.description.trim()) e.description = "Description is required.";
    }

    if (step === 2) {
      if (!Number.isFinite(state.price_per_night) || state.price_per_night < 0)
        e.price_per_night = "Enter a valid price.";
      // optional but recommended: ensure ints
      if (!Number.isFinite(state.guests) || state.guests < 1)
        e.guests = "Guests must be at least 1.";
      if (!Number.isFinite(state.beds) || state.beds < 1)
        e.beds = "Beds must be at least 1.";
      if (!Number.isFinite(state.bedrooms) || state.bedrooms < 0)
        e.bedrooms = "Bedrooms must be 0 or more.";
      if (!Number.isFinite(state.bathrooms) || state.bathrooms < 1)
        e.bathrooms = "Bathrooms must be at least 1.";
    }

    if (step === 4) {
      if (!state.location.trim()) e.location = "Location is required.";
    }

    if (step === 5) {
      // create mode requires an image; edit mode can keep existing image_url
      const hasExisting = state.imageList?.some(
        (f) => f.uid === "-1" && f.status === "done",
      );
      if (!state.imageFile && !hasExisting) e.image = "Please upload an image.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(current)) return;
    setDirection(1);
    setCurrent((c) => c + 1);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => c - 1);
  };

  const buildFormData = () => {
    const fd = new FormData();

    const weeklyRate = (Number(state.weekly_discount_rate) || 0) / 100;
    const monthlyRate = (Number(state.monthly_discount_rate) || 0) / 100;

    fd.append("category", state.category);
    fd.append("title", state.title);
    fd.append("description", state.description);

    fd.append("guests", String(Math.trunc(state.guests)));
    fd.append("bedrooms", String(Math.trunc(state.bedrooms)));
    fd.append("beds", String(Math.trunc(state.beds)));
    fd.append("bathrooms", String(Math.trunc(state.bathrooms)));

    fd.append("price_per_night", String(state.price_per_night));
    fd.append("weekly_discount_rate", String(weeklyRate));
    fd.append("monthly_discount_rate", String(monthlyRate));
    fd.append("cleaning_fee", String(state.cleaning_fee));

    fd.append("is_instant_booking", String(Boolean(state.is_instant_booking)));
    fd.append("location", state.location);

    (state.tags || []).forEach((id) => fd.append("tags", String(id)));

    if (state.imageFile) fd.append("image", state.imageFile);

    return fd;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validate current step + all required final fields
    // (or just validate all steps quickly)
    for (let s = 0; s < steps.length; s++) {
      if (!validateStep(s)) {
        setCurrent(s);
        return;
      }
    }

    const formData = buildFormData();

    if (mode === "edit") {
      dispatch(updateProperty({ propertyId: initialValues.id, formData }));
    } else {
      dispatch(createProperty(formData));
    }
  };

  const renderStep = () => {
    switch (current) {
      case 0:
        return (
          <>
            <p className="text-2xl font-bold">
              Which of these best describes your place?
            </p>
            <div className="flex justify-center items-center py-10">
              <Radio.Group
                size="large"
                buttonStyle="solid"
                value={state.category || undefined}
                onChange={(e) => setField("category", e.target.value)}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                  }}
                >
                  <Radio.Button value="House">House</Radio.Button>
                  <Radio.Button value="Apartment">Apartment</Radio.Button>
                  <Radio.Button value="Bed & Breakfast">
                    Bed & Breakfast
                  </Radio.Button>
                  <Radio.Button value="Cabin">Cabin</Radio.Button>
                  <Radio.Button value="Tent">Tent</Radio.Button>
                  <Radio.Button value="Hotel">Hotel</Radio.Button>
                  <Radio.Button value="Treehouse">Tree House</Radio.Button>
                  <Radio.Button value="Barn">Barn</Radio.Button>
                  <Radio.Button value="Container">Container</Radio.Button>
                </div>
              </Radio.Group>
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </>
        );

      case 1:
        return (
          <>
            <p className="text-2xl font-bold">Tell us more about your place</p>
            <div className="flex justify-center items-center">
              <div className="flex flex-col w-[90%] py-10 gap-4">
                <div>
                  <label className="block mb-1">Title</label>
                  <Input
                    value={state.title}
                    maxLength={255}
                    onChange={(e) => setField("title", e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">Description</label>
                  <TextArea
                    rows={10}
                    value={state.description}
                    maxLength={255}
                    showCount
                    onChange={(e) => setField("description", e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <p className="text-2xl font-bold">
              Share some basics about your place
            </p>
            <div className="flex justify-center items-center">
              <div className="w-[75%] py-10">
                {[
                  { key: "guests", label: "Guests", min: 1, max: 99 },
                  { key: "bedrooms", label: "Bedrooms", min: 0, max: 99 },
                  { key: "beds", label: "Beds", min: 1, max: 99 },
                  { key: "bathrooms", label: "Bathrooms", min: 1, max: 99 },
                ].map((f) => (
                  <div className="flex items-center" key={f.key}>
                    <label>{f.label}</label>
                    <div className="ml-auto my-4">
                      <InputNumber
                        min={f.min}
                        max={f.max}
                        step={1}
                        value={(state as any)[f.key]}
                        onChange={(v) =>
                          setField(f.key as any, Number(v ?? f.min) as any)
                        }
                      />
                    </div>
                  </div>
                ))}

                {errors.guests && (
                  <p className="text-red-500 text-sm">{errors.guests}</p>
                )}
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm">{errors.bedrooms}</p>
                )}
                {errors.beds && (
                  <p className="text-red-500 text-sm">{errors.beds}</p>
                )}
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm">{errors.bathrooms}</p>
                )}

                <div className="flex items-center">
                  <label>Price per night</label>
                  <div className="ml-auto my-4">
                    <InputNumber
                      min={0}
                      max={999999}
                      step={1}
                      prefix="₱"
                      style={{ width: 150 }}
                      value={state.price_per_night}
                      onChange={(v) =>
                        setField("price_per_night", Number(v ?? 0))
                      }
                    />
                  </div>
                </div>
                {errors.price_per_night && (
                  <p className="text-red-500 text-sm">
                    {errors.price_per_night}
                  </p>
                )}

                <Divider />

                <label className="block mb-2">Amenities</label>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select Tags"
                  options={tagOptions}
                  loading={propertyTagListLoading}
                  value={state.tags as any}
                  onChange={(vals) => setField("tags", vals as any)}
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <p className="text-2xl font-bold">
              Add discounts, miscellaneous fees, etc.
            </p>
            <div className="flex justify-center items-center">
              <div className="w-[75%] py-10">
                <div className="flex items-center">
                  <label>Weekly Discount</label>
                  <div className="ml-auto my-4">
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      prefix="%"
                      style={{ width: 100 }}
                      value={state.weekly_discount_rate}
                      onChange={(v) =>
                        setField("weekly_discount_rate", Number(v ?? 0))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label>Monthly Discount</label>
                  <div className="ml-auto my-4">
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      prefix="%"
                      style={{ width: 100 }}
                      value={state.monthly_discount_rate}
                      onChange={(v) =>
                        setField("monthly_discount_rate", Number(v ?? 0))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label>Cleaning Fee</label>
                  <div className="ml-auto my-4">
                    <InputNumber
                      min={0}
                      max={9999}
                      step={1}
                      prefix="₱"
                      style={{ width: 150 }}
                      value={state.cleaning_fee}
                      onChange={(v) => setField("cleaning_fee", Number(v ?? 0))}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label>Instant Booking</label>
                  <div className="ml-auto my-4">
                    <Switch
                      checked={state.is_instant_booking}
                      onChange={(v) => setField("is_instant_booking", v)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <p className="text-2xl font-bold">
              Where&apos;s your place located?
            </p>
            <div className="flex justify-center items-center">
              <div className="flex flex-col w-[90%] py-10">
                <label className="block mb-1">Location</label>
                <Input
                  value={state.location}
                  maxLength={255}
                  onChange={(e) => setField("location", e.target.value)}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <p className="text-2xl font-bold">Attach an image</p>
            <div className="flex justify-center items-center h-[250px]">
              <Upload
                beforeUpload={(file) => {
                  // keep file locally (no auto upload)
                  setField("imageFile", file);
                  setField("imageList", [
                    {
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      originFileObj: file as any,
                    },
                  ]);
                  return false;
                }}
                onRemove={() => {
                  setField("imageFile", null);
                  setField("imageList", []);
                }}
                fileList={state.imageList}
                listType="picture"
                maxCount={1}
              >
                <Button>Upload Image</Button>
              </Upload>
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <nav className="w-full h-16 fixed top-0 left-0 z-10 bg-secondary">
        <div className="flex justify-between items-center gap-2 mx-2 sm:mx-4 md:mx-6 lg:mx-8 h-full">
          <LeftImage />
          <div className="flex gap-4 px-4">
            <button type="button">Help</button>
            <button type="button" onClick={() => router.push("/")}>
              Exit
            </button>
          </div>
        </div>
      </nav>

      <form onSubmit={onSubmit}>
        <div className="pb-24">
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ willChange: "transform, opacity, filter" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full fixed bottom-0 left-0 z-50">
          <div className="hidden sm:block bg-transparent">
            <Steps
              progressDot
              current={current}
              items={steps.map((s, i) => ({ key: String(i), title: s.title }))}
            />
          </div>

          <div className="ui-container bg-secondary py-4">
            <div className="w-full flex justify-around items-center">
              <div>
                {current > 0 && (
                  <Button size="large" onClick={prev}>
                    Previous
                  </Button>
                )}
              </div>

              <div>
                {current < steps.length - 1 && (
                  <Button type="primary" size="large" onClick={next}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
