import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Functions } from '~/utils/Function';
import { turnoverOrder, turnoverYearDataChart } from '~/apiServices/orderServices';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // ADD THIS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'bottom'
		},
		title: {
			display: true,
			text: 'Biểu đồ thống kê doanh thu các tháng trong năm 2022',
			position: 'bottom'
		}
	}
};

const labels = [
	'Tháng 1',
	'Tháng 2',
	'Tháng 3',
	'Tháng 4',
	'Tháng 5',
	'Tháng 6',
	'Tháng 7',
	'Tháng 8',
	'Tháng 9',
	'Tháng 10',
	'Tháng 11',
	'Tháng 12'
];
const DashBoard = () => {
	const ref = useRef();
	const [ dayStart, setDayStart ] = useState(() => {
		let date = new Date();
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
	});
	const [ dayEnd, setDayEnd ] = useState(() => {
		let date = new Date();
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:59`;
	});
	const [ year, setYear ] = useState(() => {
		let date = new Date();
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
	});
	const [ data, setData ] = useState({
		labels,
		datasets: [
			{
				label: 'Tổng doanh thu',
				data: [ 100, 200, 300, 400, 500, 600, 700, 9000, 1020020, 1203123, 12312312, 12323123 ],
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			}
		]
	});
	const [ ordersTurnover, setOrdersTurnover ] = useState([]);
	const totalOrder = () => {
		let total = 0;
		for (let i = 0; i < ordersTurnover.length; i++) {
			total +=
				Functions.getPriceOrderTotal(ordersTurnover[i]) -
				Functions.getTotalDiscountVoucher(ordersTurnover[i].orderVouchers);
		}
		return total;
	};
	useEffect(() => {
		const getOrdersTurnover = async () => {
			let orders = await turnoverOrder(dayStart, dayEnd);
			let data = await turnoverYearDataChart(+year.slice(0, 4));
			setOrdersTurnover(orders);
			setData({
				labels,
				datasets: [
					{
						label: 'Tổng doanh thu',
						data,
						backgroundColor: 'rgba(255, 99, 132, 0.5)'
					}
				]
			});
		};
		getOrdersTurnover();
	}, []);
	const handleTurnover = async () => {
		if (new Date(dayStart).getTime() > new Date(dayEnd).getTime())
			return Functions.showToast('warning', 'Ngày bắt đầu không được nhỏ hơn ngày kết thúc!');
		let orders = await turnoverOrder(dayStart, dayEnd);
		setOrdersTurnover(orders);
	};
	const handleTurnoverYearChart = async () => {
		let data = await turnoverYearDataChart(+year.slice(0, 4));
		setData({
			labels,
			datasets: [
				{
					label: 'Tổng doanh thu (VNĐ) ',
					data: data,
					backgroundColor: 'rgba(255, 99, 132, 0.5)'
				}
			]
		});
	};
	return (
		<div className="wrapper p-[20px] flex flex-col  ">
			<h1 className="m-2">
				<AppRegistrationOutlinedIcon />
				<span className="text-colorPrimary font-medium my-4 mx-2  text-2xl cursor-pointer ">
					THỐNG KÊ VÀ BÁO CÁO
				</span>{' '}
			</h1>
			<div className="container flex flex-col-reverse  gap-7 ">
				<div>
					<h3>
						Báo cáo doanh thu từ ngày{' '}
						{`${new Date(dayStart).getDate()}-${new Date(dayStart).getMonth() + 1}-${new Date(
							dayStart
						).getFullYear()} `}{' '}
						đến{' '}
						{`${new Date(dayEnd).getDate()}-${new Date(dayEnd).getMonth() + 1}-${new Date(
							dayEnd
						).getFullYear()} `}
					</h3>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className="flex flex-row items-center  gap-1 ">
							<DesktopDatePicker
								label="Từ ngày"
								value={dayStart}
								onChange={(newValue) => {
									let date = new Date(newValue);
									setDayStart(
										`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`
									);
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
							<DesktopDatePicker
								label="Đến ngày"
								value={dayEnd}
								onChange={(newValue) => {
									let date = new Date(newValue);
									console.log({ date });
									setDayEnd(
										`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:59`
									);
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
							<Button onClick={handleTurnover} className="h-[38px]  " variant="outlined">
								Báo cáo
							</Button>
						</div>
					</LocalizationProvider>
					<div className={('content', 'flex-row-start', 'gap-4')}>
						<div
							style={{ boxShadow: '0px 0px 10px 2px #ddd' }}
							className={('list-cartItem', 'max-w-[800px] max-h-[450px] overflow-auto ')}
						>
							<TableContainer style={{ boxShadow: '0px 0px 10px 2px #ddd' }} component={Paper}>
								<Table
									stickyHeader={true}
									sx={{ minWidth: 650 }}
									size="medium"
									aria-label="simple table"
								>
									<TableHead className="sticky">
										<TableRow>
											<TableCell style={{ fontSize: '12px' }} align="right">
												STT{' '}
											</TableCell>
											<TableCell style={{ fontSize: '12px' }} align="right">
												Mã đơn hàng{' '}
											</TableCell>
											<TableCell style={{ fontSize: '12px' }} align="right">
												Ngày đặt
											</TableCell>
											<TableCell style={{ fontSize: '12px' }} align="right">
												Tổng thanh toán
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{ordersTurnover.map((order, index) => (
											<TableRow
												className="cursor-pointer "
												hover={true}
												key={order.orderID}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell style={{ fontSize: '12px' }} align="right">
													{index}
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="right">
													#{order.orderID}
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="right">
													{Functions.timestampToDateTime(
														new Date(order.dateCreate).getTime()
													)}
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="right">
													{Functions.toVND(
														Functions.getPriceOrderTotal(order) -
															Functions.getTotalDiscountVoucher(order.orderVouchers)
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</div>
					<h3 className={'font-medium text-2xl my-2 '}>
						Tổng doanh thu:{' '}
						<span className={'font-medium text-2xl text-colorPrimary  '}>
							{' '}
							{Functions.toVND(totalOrder())}
						</span>
					</h3>
				</div>
				<div>
					<h3>Thống kê doanh thu năm {new Date(year).getFullYear()} </h3>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<div className="flex flex-row items-center  gap-1 ">
							<DatePicker
								views={[ 'year' ]}
								label="Năm"
								value={year}
								onChange={(newValue) => {
									let date = new Date(newValue);
									setYear(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`);
								}}
								renderInput={(params) => <TextField {...params} helperText={null} />}
							/>
							<Button onClick={handleTurnoverYearChart} className="h-[38px]  " variant="outlined">
								Thống kê
							</Button>
						</div>
					</LocalizationProvider>
					<div className="w-[800px]">
						<Bar ref={ref} options={options} data={data} />;
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashBoard;
