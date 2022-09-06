import React from 'react';
import { useState } from 'react';
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
	SimpleForm,
	AutocompleteInput,
	useNotify,
	useRedirect,
	Toolbar,
	SaveButton
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

const VoucherList = (props) => {
	return (
		<List title="Danh sách mã khuyến mãi" {...props}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Danh sách mã khuyến mãi
				</span>{' '}
			</h1>
			<Datagrid>
				<TextField label="Mã khuyến mãi" source="voucherID" />
				<ReferenceField label="Sản phẩm" source="productID" reference="product">
					<TextField source="name" />
				</ReferenceField>
				<TextField label="Tiêu đề" source="title" />
				<NumberField label="Số lượng" source="quantity" />
				{/* <RichTextField source="description" /> */}
				<TextField label="Mô tả" source="description" />
				<NumberField
					label="Giảm tối đa"
					options={{ style: 'currency', currency: 'VND' }}
					source="maxDiscountValue"
				/>
				<NumberField label="Phần trăm giảm" options={{ style: 'percent' }} source="discountPercent" />
				<DateField label="Ngày bắt đầu" source="dateStart" showTime />
				<DateField label="Ngày kết thúc" source="dateEnd" showTime />

				<EditButton basepath={'/voucher'} />
			</Datagrid>
		</List>
	);
};

const validateEnd = (value) => {
	let now = new Date().getTime();
	let dayStart = localStorage.getItem('dayStart');
	if (!dayStart) return 'Ngày kết thúc >= ngày bắt đầu!';
	let dateEnd = new Date(value).getTime();
	if (dateEnd < new Date(dayStart).getTime()) return 'Ngày kết thúc >= ngày bắt đầu!';
	if (dateEnd < now) return 'Ngày kết thúc không hợp lệ!';
	return undefined;
};
const validateStart = (value) => {
	let now = new Date().getTime();
	let dateStart = new Date(value).getTime();
	if (dateStart < now) return 'Ngày bắt đầu không hợp lệ!';
	return undefined;
};
const EditVoucher = (props) => {
	localStorage.removeItem('dayStart');
	console.log({ props });
	return (
		<Edit {...props}>
			<SimpleForm>
				<h1>
					<span className="text-black font-medium my-4 text-xl cursor-pointer ">
						Chỉnh sữa mã khuyến mãi
					</span>{' '}
				</h1>
				<Labeled label="Mã Khuyến mãi">
					<TextField source="voucherID" />
				</Labeled>
				<ReferenceField label="Sản phẩm" source="productID" reference="product">
					<TextField source="name" />
				</ReferenceField>
				<TextInput label="Tiêu đề" source="title" />
				<NumberInput label="Số lượng" min={0} max={15000} source="quantity" />
				{/* <RichTextField source="description" /> */}
				<TextInput label="Mô tả" source="description" />
				<Labeled label="Phần trăm giảm">
					<NumberField label="Phần trăm giảm" options={{ style: 'percent' }} source="discountPercent" />
				</Labeled>
				{/* <NumberInput min={0.01} max={0.95} source="discountPercent" /> */}
				<Labeled label="Giảm tối đa">
					<NumberField
						label="Giảm tối đa"
						options={{ style: 'currency', currency: 'VND' }}
						source="maxDiscountValue"
					/>
				</Labeled>
				<DateTimeInput label="Ngày bắt đầu" source="dateStart" showTime />
				<DateTimeInput label="Ngày kết thúc" source="dateEnd" showTime />
			</SimpleForm>
		</Edit>
	);
};
const PostCreateToolbar = () => {
	const notify = useNotify();
	const { reset } = useFormContext();

	return (
		<Toolbar>
			<SaveButton
				type="button"
				label="ADD"
				variant="text"
				mutationOptions={{
					onSuccess: () => {
						reset();
						window.scrollTo(0, 0);
						notify('Thêm mã khuyến mãi thành công!', {
							type: 'info',
							messageArgs: { smart_count: 1 }
						});
					}
				}}
			/>
		</Toolbar>
	);
};
const CreateVoucher = (props) => {
	localStorage.removeItem('dayStart');
	return (
		<Create {...props}>
			<SimpleForm toolbar={<PostCreateToolbar />}>
				<h1>
					<span className="text-black font-medium my-4  text-xl cursor-pointer ">
						Thêm mã khuyến mãi
					</span>{' '}
				</h1>
				<ReferenceInput source="productID" reference="product">
					<AutocompleteInput label="product" optionText="name" />
				</ReferenceInput>
				<TextInput disabled={true} label="Mã sản phẩm" source="productID" />
				<TextInput className="refInput" label="Tiêu đề" source="title" />
				<NumberInput className="refInput" label="Số lượng" min={0} max={15000} source="quantity" />
				{/* <RichTextField source="description" /> */}
				<TextInput className="refInput" label="Mô tả" source="description" />
				<NumberInput
					className="refInput"
					label="Phần trăm giảm"
					min={0.01}
					max={0.95}
					source="discountPercent"
				/>
				<NumberInput className="refInput" label="Giá trị tối đa" source="maxDiscountValue" />
				<DateTimeInput
					className="refInput"
					validate={validateStart}
					label="Ngày bắt đầu "
					source="dateStart"
					onChange={(e) => {
						localStorage.setItem('dayStart', e.target.value);
					}}
					showTime
				/>
				<DateTimeInput
					className="refInput"
					validate={validateEnd}
					label="Ngày kêt thúc "
					source="dateEnd"
					showTime
				/>
			</SimpleForm>
		</Create>
	);
};
export { VoucherList, EditVoucher, CreateVoucher };
