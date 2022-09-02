import React, { useState, useRef } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { useSelector } from 'react-redux';
import { Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Functions } from '~/utils/Function';
import {
	updateCommentProduct,
	deleteCommentProduct,
	addReplyComment,
	deleteReplyComment,
	updateReplyComment
} from '~/apiServices/productServices';
const cx = classNames.bind(styles);
const CommentReply = ({ comment }) => {
	const loginStore = useSelector((state) => state.login);
	const [ commentShow, setCommentShow ] = useState(comment);
	const [ content, setContent ] = useState('');
	const editContentCmtRef = useRef();
	const showContentCmtRef = useRef();
	const addContentCmtRef = useRef();
	const editReplyRef = useRef();
	const showReplyRef = useRef();

	const navigate = useNavigate();
	const handleShowEditComment = () => {
		if (showContentCmtRef.current.style.display === 'block') {
			showContentCmtRef.current.style.display = 'none';
			editContentCmtRef.current.style.display = 'block';
		} else {
			showContentCmtRef.current.style.display = 'block';
			editContentCmtRef.current.style.display = 'none';
			updateCommentProduct(commentShow.commentID, commentShow.content);
		}
	};
	const handleAddEditComment = async () => {
		if (addContentCmtRef.current.style.display === 'block') {
			addContentCmtRef.current.style.display = 'none';
			setContent('');
		} else {
			addContentCmtRef.current.style.display = 'block';
		}
	};
	const handleEditReply = async (replyContent, replyID) => {
		console.log(replyContent, replyID);
		let editElement = document.getElementById(`editRep_${replyID} `)
		if (editElement.style.display === 'none') {
			showReplyRef.current.style.display = 'none';
			editElement.style.display = 'block';
			setContent(replyContent);
		} else if(showReplyRef.current.style.display === 'none') {
			//
			updateReplyComment(replyID, content);
			setCommentShow((pre) => {
				let index = pre.replies.findIndex((rep) => rep.replyID === replyID);
				pre.replies[index].content = content;
				return { ...pre };
			});
			//
			showReplyRef.current.style.display = 'block';
			editElement.style.display = 'none';
			setContent('');
		}
	};
	const handleAddReply = async () => {
		let rest = await addReplyComment({
			commentID: commentShow.commentID,
			username: loginStore.login.username,
			content
		});
		if (rest.status !== 201) return Functions.showToast('error', 'Lỗi thêm trả lời!');

		setCommentShow((pre) =>{
			if(!pre.replies){
				pre.replies = []
			}
			return  ({ ...pre, replies: [ ...pre.replies, { ...rest.data } ] });
		})
		addContentCmtRef.current.style.display = 'none';
		setContent('');
	};
	if (!commentShow) return <React.Fragment />;
	return (
		<div className={cx('my-2 p-4')}>
			<div className={cx('comment p-4')}>
				<div className={cx('flex-row-start gap-4 font-medium')}>
					<Avatar alt="avatar">{commentShow.username}</Avatar>
					{commentShow.username}
					<span className="text-base font-light">
						{Functions.timestampToDateTime(new Date(comment.updatedAt).getTime())}
					</span>
					{/* {loginStore.isLogin && loginStore.login.role !== 'customer' && <span className="text-base font-light text-red-700 ">Quản trị viên</span> } */}
					{loginStore.isLogin &&
					loginStore.login.username === commentShow.username && (
						<EditOutlinedIcon onClick={handleShowEditComment} className={cx('hover:cursor-pointer')} />
					)}
					{loginStore.isLogin &&
					loginStore.login.username === commentShow.username && (
						<DeleteOutlineOutlinedIcon
							onClick={() => {
								let confirm = window.confirm('Bạn có chắc muốn xóa bình luận này?');
								if (confirm) {
									deleteCommentProduct(commentShow.commentID);
									setCommentShow();
								}
							}}
							className={cx('hover:cursor-pointer')}
						/>
					)}
				</div>
				<p ref={showContentCmtRef}>{commentShow.content}</p>
				<input
					style={{
						display: 'none',
						width: '100%',
						height: '68px',
						borderRadius: '4px',
						border: 'solid 1px #ced4da',
						backgroundColor: '#fff',
						padding: '8px 123px 8px 8px',
						outline: 0
					}}
					ref={editContentCmtRef}
					value={commentShow.content}
					onChange={(e) => {
						setCommentShow((pre) => ({ ...pre, content: e.target.value }));
					}}
				/>
				<div className={cx('flex gap-4')}>
					<Button
						onClick={() => {
							if (!loginStore.isLogin)
								return Functions.showToast('warning', 'Hãy đăng nhập để bình luận sản phẩm!');
							handleAddEditComment();
						}}
						className={cx('hover:cursor-pointer')}
					>
						Trả lời
					</Button>
				</div>
			</div>
			<div className="replies ml-6 px-4">
				<div
					style={{
						display: 'none'
					}}
					ref={addContentCmtRef}
				>
					<input
						style={{
							width: '100%',
							height: '68px',
							borderRadius: '4px',
							border: 'solid 1px #ced4da',
							backgroundColor: '#fff',
							padding: '8px 123px 8px 8px',
							outline: 0
						}}
						value={content}
						onChange={(e) => {
							setContent(e.target.value);
						}}
					/>
					<Button onClick={handleAddReply}>Gửi</Button>
				</div>
				{commentShow.replies?.map((reply) => {
					return (
						<div key={reply.replyID} className="my-4">
							<div className={cx('flex-row-start gap-4 font-medium')}>
								<Avatar alt="avatar">{reply.username}</Avatar>
								{reply.username}
								<span className="text-base font-light">
									{Functions.timestampToDateTime(new Date(reply.updateAt).getTime())}
								</span>
								{loginStore.isLogin &&
								loginStore.login.username === reply.username && (
									<EditOutlinedIcon
										onClick={() => handleEditReply(reply.content, reply.replyID)}
										className={cx('hover:cursor-pointer')}
									/>
								)}
								{loginStore.isLogin &&
								loginStore.login.username === reply.username && (
									<DeleteOutlineOutlinedIcon
										onClick={() => {
											let confirm = window.confirm('Bạn có chắc muốn xóa trả lời này?');
											if (confirm) {
												deleteReplyComment(reply.replyID);
												setCommentShow((pre) => {
													pre.replies = pre.replies.filter(
														(rep) => rep.replyID !== reply.replyID
													);
													return { ...pre };
												});
											}
										}}
										className={cx('hover:cursor-pointer')}
									/>
								)}
							</div>
							<p ref={showReplyRef}>{reply.content}</p>
							<input
								ref={editReplyRef}
								id={`editRep_${ reply.replyID} ` }
								style={{
									display: 'none',
									width: '100%',
									height: '68px',
									borderRadius: '4px',
									border: 'solid 1px #ced4da',
									backgroundColor: '#fff',
									padding: '8px 123px 8px 8px',
									outline: 0
								}}
								value={content}
								onChange={(e) => {
									setContent(e.target.value);
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default CommentReply;
