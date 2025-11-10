export interface Cinema {
  uid: string;
  cityUid: string,
  name: string;
  address: string;
  phone: string;
  active: boolean;
  halls: Hall[];
}


export interface City {
  uid: string;
  name: string;
}

  export interface Hall {
  uid: string;
  cinema_uid: string;
  name: string;
  seats: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
