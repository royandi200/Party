export type Gender = "male" | "female";
export type Zone = "vip" | "main" | "lower";

export interface Attendee {
  name: string;
  gender: Gender;
  zone: Zone;
  vip: boolean;
  seat: string;
  insta: string;
  photoUrl?: string;
}

export type Screen = "deck" | "list" | "register";
export type Filter = "all" | "male" | "female" | "vip";
