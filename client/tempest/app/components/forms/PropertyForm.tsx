import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Upload,
  Steps,
  theme,
} from "antd";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  createProperty,
  getPropertyList,
  resetCreateProperty,
  resetPropertyList,
  updateProperty,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";

const { TextArea } = Input;

type PropertyFormProps = {
  mode: "create" | "edit";
  initialValues?: any;
  onSuccess?: () => void;
};

const steps = [
  {
    title: "Category",
  },
  {
    title: "Describe your place",
  },
  {
    title: "Details",
  },
  {
    title: "Location",
  },
  {
    title: "Image",
  },
];

function PropertyForm({ mode, initialValues, onSuccess }: PropertyFormProps) {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const { error, loading, success, message } = useAppSelector((state) =>
    mode === "create"
      ? state.property.createProperty
      : state.property.updateProperty
  );
  const dispatch = useAppDispatch();

  const next = async () => {
    try {
      // validate only the fields in the current step
      let fieldsToValidate: string[] = [];
      switch (current) {
        case 0:
          fieldsToValidate = ["category"];
          break;
        case 1:
          fieldsToValidate = ["title", "description"];
          break;
        case 2:
          fieldsToValidate = ["price_per_night"];
          break;
        case 3:
          fieldsToValidate = ["location"];
          break;
        case 4:
          fieldsToValidate = ["image"];
          break;
        default:
          fieldsToValidate = [];
      }

      await form.validateFields(fieldsToValidate);
      setCurrent(current + 1);
    } catch (error) {
      // validation failed, stay on the current step
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  // SLIDER CODE END

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: initialValues.image
          ? [
              {
                uid: "-1",
                name: "current-image.jpg",
                status: "done",
                url: initialValues.image, // <-- IMPORTANT
              },
            ]
          : [],
      });
    }
  }, [mode, initialValues]);

  useEffect(() => {
    if (success) {
      toast.success(
        mode === "create"
          ? "Property created successfully"
          : "Property updated successfully"
      );

      dispatch(getPropertyList());
      dispatch(resetPropertyList());

      if (onSuccess) onSuccess();
    }
    if (error) {
      toast.error(message);
    }
    dispatch(resetCreateProperty());
  }, [success, error, message, mode, onSuccess, dispatch]);

  const onFinish = (values: any) => {
    const formData = new FormData();

    formData.append("category", values.category);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("bedrooms", values.bedrooms);
    formData.append("beds", values.beds);
    formData.append("bathrooms", values.bathrooms);
    formData.append("guests", values.guests);
    formData.append("price_per_night", values.price_per_night);
    formData.append("location", values.location);
    formData.append("image", values.image?.[0]?.originFileObj); // do this if using antd upload

    if (values.image && values.image[0]?.originFileObj) {
      formData.append("image", values.image[0].originFileObj);
    }

    if (mode === "edit") {
      dispatch(
        updateProperty({
          propertyId: initialValues.id,
          formData,
        })
      );
    } else {
      dispatch(createProperty(formData));
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Steps current={current} items={items} />
      <div>
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <div className="flex justify-center items-center sm:h-[200px] md:h-[450px]">
            <Form.Item
              name="category"
              preserve={true}
              label={
                <span className="text-lg font-bold my-4">
                  Which of these best describes your place?
                </span>
              }
              rules={[{ required: true }]}
              required={false}
            >
              <Radio.Group size="large">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
                    gap: 8, // gap between buttons
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
            </Form.Item>
          </div>
        </div>
        <div style={{ display: current === 1 ? "block" : "none" }}>
          <div className="flex justify-center items-center sm:h-[200px] md:h-[450px]">
            <div className="flex flex-col w-[400px]">
              <span className="text-lg font-bold my-4">
                Describe your place
              </span>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Title is required" }]}
                required={false}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Description is required" }]}
                required={false}
              >
                <TextArea rows={8} style={{ resize: "none" }} />
              </Form.Item>
            </div>
          </div>
        </div>
        <div style={{ display: current === 2 ? "block" : "none" }}>
          <div className="flex justify-center items-center sm:h-[200px] md:h-[450px]">
            <div className="w-[400px]">
              <span className="text-lg font-bold my-4">
                Which of these best describes your place?
              </span>
              <div className="flex items-center">
                <label>Guests</label>
                <div className="ml-auto my-4">
                  <Form.Item
                    name="guests"
                    initialValue={1}
                    rules={[{ required: true, message: "Guests required" }]}
                    required={false}
                    noStyle
                  >
                    <InputNumber min={1} max={99} step={1} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <label>Bedrooms</label>
                <div className="ml-auto my-4">
                  <Form.Item
                    name="bedrooms"
                    initialValue={0}
                    rules={[{ required: true, message: "Guests required" }]}
                    required={false}
                    noStyle
                  >
                    <InputNumber min={0} max={99} step={1} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <label>Beds</label>
                <div className="ml-auto my-4">
                  <Form.Item
                    name="beds"
                    initialValue={1}
                    rules={[{ required: true, message: "Guests required" }]}
                    required={false}
                    noStyle
                  >
                    <InputNumber min={1} max={99} step={1} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <label>Bathrooms</label>
                <div className="ml-auto my-4">
                  <Form.Item
                    name="bathrooms"
                    initialValue={1}
                    rules={[{ required: true, message: "Guests required" }]}
                    required={false}
                    noStyle
                  >
                    <InputNumber min={1} max={99} step={1} />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-center">
                <label>Price per night</label>
                <div className="ml-auto my-4">
                  <Form.Item
                    name="price_per_night"
                    initialValue={0}
                    rules={[{ required: true, message: "required!" }]}
                    required={true}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      step={1}
                      prefix="₱"
                      style={{ width: 150 }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: current === 3 ? "block" : "none" }}>
          <div className="flex justify-center items-center sm:h-[200px] md:h-[450px]">
            <div className="flex flex-col w-[400px]">
              <span className="text-lg font-bold my-4">
                Where's your place located?
              </span>
              <Form.Item
                name="location"
                rules={[{ required: true, message: "Location is required" }]}
                required={false}
              >
                <Input></Input>
              </Form.Item>
            </div>
          </div>
        </div>
        <div style={{ display: current === 4 ? "block" : "none" }}>
          <div className="flex justify-center items-center sm:h-[200px] md:h-[450px]">
            <div className="flex flex-col w-[400px]">
              <span className="text-lg font-bold my-4">Add images</span>

              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  beforeUpload={() => false} // prevent auto upload
                  listType="picture"
                  maxCount={1}
                >
                  <Button>Upload Image</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" htmlType="submit">
            Done
          </Button>
        )}
      </div>
    </Form>
  );
}

export default PropertyForm;
