import React from 'react';
import {
	Edit,
	EditButton,
	List,
	Datagrid,
	TextField,
	TextInput,
	DateField,
	ArrayField,
	ArrayInput,
	ImageField,
	RichTextField,
	ReferenceField,
	Labeled,
	ImageInput,
	DateTimeInput,
	NumberInput,
	SimpleFormIterator,
	ChipField,
	FileInput,
	FormDataConsumer,
	SimpleShowLayout,
	TabbedForm,
	FormTab,
	Create,
	NumberField,
	ReferenceInput,
	SelectInput,
	SearchInput
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
import { Box, Pagination, Typography } from '@mui/material';
const Empty = () => (
	<Box textAlign="center" m={1}>
		<Typography variant="h4" paragraph>
			Không có sản phẩm nào!
		</Typography>
	</Box>
);
const DescriptionShow = () => (
	<SimpleShowLayout>
		<RichTextField label="Mô tả sản phẩm" source="description" />
	</SimpleShowLayout>
);
const productFilters = [ <SearchInput placeholder="Tìm kiếm sản phẩm" source="searchText" alwaysOn /> ];
const ProductList = (props) => {
	return (
		<List {...props} filters={productFilters} {...props}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Danh sách sản phẩm
				</span>{' '}
			</h1>
			<Datagrid empty={<Empty />} expand={<DescriptionShow />}>
				<TextField label="Mã sản phẩm" source="productID" />
				<ReferenceField label="Danh mục" source="categoryID" reference="categories">
					<TextField source="name" />
				</ReferenceField>
				<TextField label="Tên sản phẩm" source="name" />
				<NumberField label="Giá sản phẩm" source="price" options={{ style: 'currency', currency: 'VND' }} />
				<NumberField label="Số lượng còn" source="quantity" />
				{/* <RichTextField source="description" /> */}
				<TextField label="Thương hiệu" source="brand" />
				<TextField label="Xuất xứ" source="origin" />
				<NumberField label=" Bảo hành (Tháng)" source="guarantee" />
				{/* <NumberField label="discountPercent (%)" source="discountPercent" options={{ style: 'percent' }} />
					<DateField source="dateDiscountStart" showTime />
					<DateField source="dateDiscountEnd" showTime /> */}
				{/* <ArrayField source="attributes">
					<Datagrid>
						<TextField source="name" />
						<TextField source="value" />
					</Datagrid>
				</ArrayField> */}
				<ImageField label="Ảnh nền" source="thumbnail" title="Ảnh nền" />
				{/* <ArrayField source="images">
					<Datagrid>
						<TextField source="id" />
						<UrlField label="Product Image" source="imageURL" />
					</Datagrid>
				</ArrayField> */}
				<EditButton basepath={'/product'} />
			</Datagrid>
		</List>
	);
};

const EditProduct = (props) => {
	return (
		<Edit {...props} mutationMode="pessimistic">
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Chỉnh sửa thông tin sản phẩm
				</span>{' '}
			</h1>
			<TabbedForm>
				<FormTab label="SUM">
					<Labeled label="Mã sản phẩm">
						<TextField source="productID" />
					</Labeled>
					<Labeled label="Danh mục">
						<ReferenceField label="Danh mục" source="categoryID" reference="categories">
							<TextField source="name" />
						</ReferenceField>
					</Labeled>

					<div>
						<TextInput label="Tên sản phẩm" source="name" />
						<NumberInput label="Giá" min={1} source="price" />
						<NumberInput label="Số lượng còn" min={0} source="quantity" />
						<TextInput label="Thương hiệu" source="brand" />
						<TextInput label="Xuất xứ" source="origin" />
						<NumberInput label="Bảo hành (tháng)" min={1} source="guarantee" />
					</div>
					<div>
						<NumberInput label="Phần trăm giảm" min={0.0} max={0.95} step={0.1} source="discountPercent" />
						<DateTimeInput label="Ngày băt đầu" source="dateDiscountStart" />
						<DateTimeInput label="Ngày kết thúc" source="dateDiscountEnd" />
					</div>
				</FormTab>
				<FormTab label="MÔ TẢ">
					<RichTextInput label="Mô tả sản phẩm" source="description" />
				</FormTab>
				<FormTab label="DANH SÁCH THUỘC TÍNH">
					<ArrayInput label="Danh sách thuộc tính" source="attributes">
						<SimpleFormIterator disableAdd disableRemove>
							<ChipField label="Tên thuộc tính" source="name" />
							<TextInput resettable={true} label="Giá trị" source={'value'} />
						</SimpleFormIterator>
					</ArrayInput>
				</FormTab>
				<FormTab label="HÌNH ẢNH">
					{/* start thumbail */}
					<FileInput
						source="newThumbnail"
						label="Danh sách"
						accept="image/*"
						placeholder={<p>Tải hình ảnh</p>}
					>
						<ImageField label="Ảnh" source="newThumbnail" title="title" />
					</FileInput>
					<FormDataConsumer>
						{({ formData, dispatch, ...rest }) => {
							if (!formData.newThumbnail) {
								return (
									<div>
										<Labeled label="Ảnh nền sản phẩm">
											<ImageField source="thumbnail" {...rest} />
										</Labeled>
									</div>
								);
							}
						}}
					</FormDataConsumer>

					{/* end thumbail */}
					<ArrayInput label="Danh sách hình ảnh sản phẩm" source="images">
						<SimpleFormIterator disableAdd>
							<ImageField source="imageURL" title="title" />
						</SimpleFormIterator>
					</ArrayInput>
					<ArrayInput label="Danh sách hình ảnh" source="newImages">
						<SimpleFormIterator>
							<ImageInput
								source="imageURL"
								label="Hình ảnh"
								accept="image/*"
								placeholder={<p>Tải ảnh</p>}
							>
								<ImageField source="imageURL" title="title" />
							</ImageInput>
						</SimpleFormIterator>
					</ArrayInput>
				</FormTab>
			</TabbedForm>
		</Edit>
	);
};

const CreateProduct = (props) => {
	return (
		<Create {...props}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Thêm sản phẩm mới
				</span>{' '}
			</h1>
			<TabbedForm>
				<FormTab label="DANH MỤC">
					<ReferenceInput source="categoryID" reference="categories">
						<SelectInput label="Danh mục" optionText="name" />
					</ReferenceInput>
				</FormTab>

				<FormTab label="SUM">
					<div>
						<TextInput label="Tên sản phẩm" source="name" />
						<NumberInput label="Giá sản phẩm" min={1} source="price" />
						<NumberInput label="Số lượng" min={1} source="quantity" />
						<TextInput label="Nhãn hiệu" source="brand" />
						<TextInput label="Xuất xứ" source="origin" />
						<NumberInput label="Bảo hành (tháng)" min={1} source="guarantee" />
					</div>
					<div>
						<NumberInput label="Phần trăm giảm" min={0.0} max={0.95} step={0.1} source="discountPercent" />
						<DateTimeInput label="Ngày bắt đầu" source="dateDiscountStart" />
						<DateTimeInput label="Ngày kết thúc" source="dateDiscountEnd" />
					</div>
				</FormTab>
				<FormTab label="MÔ TẢ">
					<RichTextInput label="Mô tả" source="description" />
				</FormTab>

				<FormTab label="HÌNH ẢNH">
					{/* start thumbail */}
					<FileInput source="thumbnail" label="Hình nền" accept="image/*" placeholder={<p>Tải ảnh</p>}>
						<ImageField source="thumbnail" title="title" />
					</FileInput>

					{/* end thumbail */}

					<ImageInput
						source="images"
						label="Hình ảnh cho sảnh phẩm"
						accept="image/*"
						multiple={true}
						placeholder={<p>Tải ảnh</p>}
					>
						<ImageField source="images" title="title" />
					</ImageInput>
				</FormTab>
			</TabbedForm>
		</Create>
	);
};

export { ProductList, EditProduct, CreateProduct };
