import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Upload,
  message,
  Steps,
  theme,
} from "antd";

const { TextArea } = Input;

type CreatePropertyModalProps = {
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

function CreatePropertyModal({ onSuccess }: CreatePropertyModalProps) {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

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
          fieldsToValidate = ["images"];
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

  const onFinish = (values: any) => {
    console.log("All form data:", values);
    message.success("Processing complete!");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Steps current={current} items={items} />
      <div style={{ marginTop: 24 }}>
        {current === 0 && (
          <div className="flex justify-center items-center h-[400px]">
            <Form.Item
              name="category"
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
                  <Radio.Button value="house">House</Radio.Button>
                  <Radio.Button value="apartment">Apartment</Radio.Button>
                  <Radio.Button value="bed&breakfast">
                    Bed & Breakfast
                  </Radio.Button>
                  <Radio.Button value="cabin">Cabin</Radio.Button>
                  <Radio.Button value="tent">Tent</Radio.Button>
                  <Radio.Button value="hotel">Hotel</Radio.Button>
                  <Radio.Button value="treehouse">Tree House</Radio.Button>
                  <Radio.Button value="barn">Barn</Radio.Button>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
        )}
        {current === 1 && (
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col w-[400px]">
              <span className="text-lg font-bold my-4">Describe you place</span>
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
        )}
        {current === 2 && (
          <div className="flex justify-center items-center h-[400px]">
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
                    name="bedroom"
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
        )}
        {current === 3 && (
          <div className="flex justify-center items-center h-[400px]">
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
        )}
        {current === 4 && (
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col w-[400px]">
              <span className="text-lg font-bold my-4">Add images</span>

              <Form.Item
                name="image"
                label="Upload Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Please upload an image" }]}
              >
                <Upload
                  name="image"
                  listType="picture-card"
                  beforeUpload={() => false} // prevents auto upload
                  maxCount={1}
                  onChange={({ fileList }) => {
                    // update form value manually when upload changes
                    form.setFieldsValue({ image: fileList });
                  }}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                >
                  {/* hide upload button if 1 file already uploaded */}
                  {form.getFieldValue("image")?.length >= 1 ? null : (
                    <div>Click or Drag to Upload</div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Form>
  );
}

export default CreatePropertyModal;
