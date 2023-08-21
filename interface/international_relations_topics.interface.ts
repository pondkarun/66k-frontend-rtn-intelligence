export interface international_relations_topicsAttributes {
    id: string;
    name: string;
    guide_line_specific_field?: object;
    last_node?: boolean;
    parent_id?: string;
    sort?: number;
    is_use: boolean;
    created_by?: string;
    created_date?: Date;
    updated_by?: string;
    updated_date?: Date;
    children: international_relations_topicsAttributes[] | []
}

export type Tforminternational = {
    event_name: string
    event_venue: string
    leader_name_thai: string
    leader_name_foreign: string
    event_date: string
    file: File
    image: File
}