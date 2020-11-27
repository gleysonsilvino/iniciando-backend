import Router from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPassordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPassordController = new ResetPassordController();

passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPassordController.create);

export default passwordRouter;
