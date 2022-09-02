import React, { useId } from 'react';
import {
	Edit,
	EditButton,
	TextInput,
	List,
	Datagrid,
	TextField,
	SingleFieldList,
	ArrayField,
	ChipField,
	SimpleForm,
	Create,
	ArrayInput,
	SimpleFormIterator,
	Labeled,
	useNotify,
	SaveButton,
	Toolbar
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
const CategoriesList = (props) => {
	return (
		<List {...props}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Danh mục sản phẩm
				</span>{' '}
			</h1>
			<Datagrid key={useId()}>
				<TextField label="Mã Danh mục" source="categoryID" />
				<TextField label="Tên" source="name" />
				<ArrayField label="Thuộc tính" source="attributes">
					<SingleFieldList>
						<ChipField source="name" />
					</SingleFieldList>
				</ArrayField>
				<EditButton basepath="/categories" />
			</Datagrid>
		</List>
	);
};

const EditCategory = (props) => {
	return (
		<Edit {...props} mutationMode="pessimistic">
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Chỉnh sửa danh mục
				</span>{' '}
			</h1>
			<SimpleForm>
				<Labeled label="Mã danh mục">
					<TextField source="categoryID" />
				</Labeled>
				<TextInput label="Tên" source="name" />
				<ArrayInput label="Danh sách thuộc tính" source="attributes">
					<SimpleFormIterator>
						<TextInput resettable={true} label="Thuộc tính" source="name" />
					</SimpleFormIterator>
				</ArrayInput>
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
						notify('Thêm danh mục thành công!', {
							type: 'info',
							messageArgs: { smart_count: 1 }
						});
					}
				}}
			/>
		</Toolbar>
	);
};
const CreateCategory = (props) => {
	return (
		<Create {...props}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Thêm mới danh mục
				</span>{' '}
			</h1>
			<SimpleForm toolbar={<PostCreateToolbar />}>
				<TextInput label="Tên Danh mục" source="name" />
				<ArrayInput label="Danh sách thuộc tính" source="attributes">
					<SimpleFormIterator>
						<TextInput resettable={true} label="Thuộc tính" source="name" />
					</SimpleFormIterator>
				</ArrayInput>
			</SimpleForm>
		</Create>
	);
};
export { CategoriesList, EditCategory, CreateCategory };
