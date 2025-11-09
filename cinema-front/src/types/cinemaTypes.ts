export interface Hall {
  id: string;
  name: string;
  seats: number;
  active: boolean;
}

export interface Cinema {
  uid: string;
  cityUid: string,
  name: string;
  address: string;
  phone: string;
  active: boolean;
  halls: Hall[];
}
