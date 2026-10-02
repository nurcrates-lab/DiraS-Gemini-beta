export type Lang = 'auto'|'id'|'en'|'ar';
export type ResponseType = 'short_text'|'long_text'|'table'|'comparison_table'|'case_analysis'|'reflection';
export interface Objective { id:string; text:string; cognitiveLevel:string }
export interface Task { id:string; task:string; responseType:ResponseType; responseConfig?: { columns?:string[]; rows?: string[]|number; fields?:string[] } }
export interface Activity { id:string; title:string; learningStage:string; objectiveReference:string[]; instruction:string; studentTasks:Task[] }
export interface Workbook {
 metadata:{lessonTitle:string;subject:string;learningLevel:string;learningMethod:string;duration:string;difficulty:string;language:'id'|'en'|'ar';direction:'ltr'|'rtl'};
 learningObjectives:Objective[]; learningInstructions:string[];
 apperception:{title:string;content:string;studentAction:string};
 stimulus:{title:string;type:string;content:string};
 triggerQuestions:{id:string;question:string;purpose:string}[];
 materialSnapshot:{title:string;content:string};
 activities:Activity[];
 reflection:{id:string;question:string;responseType:'long_text'}[];
 assessment:{id:string;objectiveReference:string[];question:string;type:string;cognitiveLevel:string;expectedEvidence:string}[];
 rubric:{included:boolean;criteria:{criterion:string;levels:{score:number;descriptor:string}[]}[]};
 conclusion:{instruction:string};
}
export interface LessonInput { lessonTitle:string; learningLevel:string; objectives:string[]; materials:string[]; learningMethod:string; duration:string; difficulty:string; activityCount:number; studentContext:string; language:Lang }
