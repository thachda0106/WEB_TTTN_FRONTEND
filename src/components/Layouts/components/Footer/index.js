import React from 'react';
import './styles.css';
function Footer() {
	return (
		<div className="w-full mt-10 ">
			<div id="footer">
				<div className="wrapper-content">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
							<ul className="list-unstyled list-inline social text-center">
								<li className="list-inline-item">
									<a href="javascript:void();">
										<i className="fa fa-facebook" />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="javascript:void();">
										<i className="fa fa-twitter" />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="javascript:void();">
										<i className="fa fa-instagram" />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="javascript:void();">
										<i className="fa fa-google-plus" />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="javascript:void();" target="_blank">
										<i className="fa fa-envelope" />
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-black">
							<p>
								<u>
									<a href="https://www.nationaltransaction.com/">National Transaction Corporation</a>
								</u>{' '}
								is a Registered MSP/ISO of Elavon, Inc. Georgia [a wholly owned subsidiary of U.S.
								Bancorp, Minneapolis, MN]
							</p>
							<p className="h6">
								&copy All right Reversed.<a
									className="text-green ml-2"
									href="https://www.sunlimetech.com"
									target="_blank"
								>
									Sunlimetech
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Footer;
