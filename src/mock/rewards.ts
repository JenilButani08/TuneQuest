import { Reward, Wallet, PointTransaction } from '../types';
import rewardsJson from '../data/rewards.json';

export const mockWallet: Wallet = rewardsJson.wallet as Wallet;
export const mockTransactions: PointTransaction[] = rewardsJson.transactions as PointTransaction[];
export const mockRewards: Reward[] = rewardsJson.rewards as Reward[];
