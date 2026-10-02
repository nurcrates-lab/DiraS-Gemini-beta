import { NextResponse } from 'next/server';
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
export async function POST(req:Request){
 const wb=await req.json(); const rtl=wb.metadata.direction==='rtl';
 const p=(text:string, heading?:any)=>new Paragraph({text,bidirectional:rtl,alignment:rtl?'right':'left',heading});
 const children:any[]=[p(wb.metadata.lessonTitle,HeadingLevel.TITLE),p(`${wb.metadata.learningLevel} • ${wb.metadata.learningMethod}`),p(''),p(rtl?'أهداف التعلم':'Learning Objectives',HeadingLevel.HEADING_1)];
 wb.learningObjectives.forEach((o:any,i:number)=>children.push(p(`${i+1}. ${o.text}`)));
 children.push(p(rtl?'التعليمات':'Instructions',HeadingLevel.HEADING_1)); wb.learningInstructions.forEach((x:string)=>children.push(p('• '+x)));
 children.push(p(wb.apperception.title,HeadingLevel.HEADING_1),p(wb.apperception.content),p(wb.apperception.studentAction));
 children.push(p(wb.stimulus.title,HeadingLevel.HEADING_1),p(wb.stimulus.content));
 children.push(p(wb.materialSnapshot.title,HeadingLevel.HEADING_1),p(wb.materialSnapshot.content));
 wb.activities.forEach((a:any,i:number)=>{children.push(p(`${rtl?'النشاط':'Activity'} ${i+1}: ${a.title}`,HeadingLevel.HEADING_1),p(a.instruction)); a.studentTasks.forEach((t:any)=>{children.push(p(t.task)); if(t.responseType==='table'||t.responseType==='comparison_table'){const cols=t.responseConfig?.columns||['Response']; const rows=Array.isArray(t.responseConfig?.rows)?t.responseConfig.rows:Array.from({length:t.responseConfig?.rows||3},()=> ''); children.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[new TableRow({children:cols.map((c:string)=>new TableCell({children:[p(c)]}))}),...rows.map((r:string)=>new TableRow({children:cols.map((c:string,idx:number)=>new TableCell({children:[p(idx===0?r:'')]}))}))]}));} else {children.push(p('____________________________________________'),p('____________________________________________'),p('____________________________________________'));}})});
 children.push(p(rtl?'التأمل':'Reflection',HeadingLevel.HEADING_1)); wb.reflection.forEach((r:any)=>children.push(p(r.question),p('____________________________________________'),p('____________________________________________')));
 children.push(p(rtl?'التقويم':'Assessment',HeadingLevel.HEADING_1)); wb.assessment.forEach((a:any,i:number)=>children.push(p(`${i+1}. ${a.question}`),p('____________________________________________'),p('____________________________________________')));
 if(wb.rubric?.included){children.push(p(rtl?'معايير التقييم':'Rubric',HeadingLevel.HEADING_1)); for(const c of wb.rubric.criteria){children.push(p(c.criterion,HeadingLevel.HEADING_2)); c.levels.forEach((l:any)=>children.push(p(`${l.score}: ${l.descriptor}`)));}}
 children.push(p(rtl?'الخلاصة':'Conclusion',HeadingLevel.HEADING_1),p(wb.conclusion.instruction),p('____________________________________________'));
 const doc=new Document({sections:[{children}]}); const buf=await Packer.toBuffer(doc);
 return new NextResponse(buf as any,{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','Content-Disposition':`attachment; filename="diras-workbook.docx"`}});
}
