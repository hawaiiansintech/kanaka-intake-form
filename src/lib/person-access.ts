
let _person_by_id: Map<number,any> = new Map<number, number>();
let _next_id: number = 0;

export function get_person_list(): Map<number,any> {
    return _person_by_id;
}

export function edit_person(person_id: number, person: any): boolean {
  _person_by_id.set(person_id, person);
  return true;
}

export function delete_person(person_id: number): boolean {
  return _person_by_id.delete(person_id);
}

export function add_person(person: any): number {
  let curr_id = _next_id++;
   _person_by_id.set(curr_id, person);
   return curr_id;
}