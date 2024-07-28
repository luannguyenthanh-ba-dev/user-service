export class RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  birthday: string;
  height?: number;
  weight?: number;
  threeRounds?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };
  gender: 0 | 1 | 2;

  password: string;
  major?: string;
}
