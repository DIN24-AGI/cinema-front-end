export interface Cinema {
  uid: string;
  city_uid: string,
  city_name?: string | undefined;
  name: string;
  address: string;
  phone: string;
  active: boolean;

}


export interface City {
  uid: string;
  name: string;
}

  export interface Hall {
  uid: string;
  cinema_uid: string;
  name: string;
  rows: number,
  cols: number,
  seats: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
