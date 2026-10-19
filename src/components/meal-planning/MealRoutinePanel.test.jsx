import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import MealRoutinePanel from './MealRoutinePanel';
import axios from '../../lib/axios';

let root,host,oldAdapter,requests;
const plan={id:20,startDate:'2026-10-17',endDate:'2026-10-23',menu:{targetDailyCalories:2000,days:[{date:'2026-10-17',meals:[{mealTime:'breakfast',name:'Tofu congee'}]}]},
  routine:{mode:'weight_goal',state:'active',version:3,targetWeightKg:60,targetDate:'2027-01-01',timeZoneId:'UTC',breakfastTime:'07:30:00',lunchTime:'12:00:00',dinnerTime:'18:30:00',remindersEnabled:false,
    entries:[{date:'2026-10-17',mealTime:'breakfast',status:'unlogged',dueAt:'2026-10-17T00:00:00Z'}]}};
beforeEach(()=>{
  global.IS_REACT_ACT_ENVIRONMENT=true;host=document.createElement('div');document.body.appendChild(host);root=createRoot(host);
  oldAdapter=axios.defaults.adapter;requests=[];
  axios.defaults.adapter=async config=>{requests.push(config);return {config,status:200,headers:{},data:config.url.endsWith('revision-preview')?
    {allowed:false,reasons:['The remaining timeline needs an unsafe calorie deficit.'],version:3,profileFingerprint:'abc',targetCalories:900,tdee:2000,effectiveFrom:'2026-10-18'}:{...plan.routine,version:4}};};
});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();axios.defaults.adapter=oldAdapter;});
test('unsafe reassessment displays the server reason and cannot confirm a revision',async()=>{
  await act(async()=>root.render(<MealRoutinePanel plan={plan} onPlanChanged={()=>{}} onEditProfile={()=>{}} />));
  const button=[...host.querySelectorAll('button')].find(b=>b.textContent.includes('Review adjustment'));
  await act(async()=>button.click());
  expect(host.textContent).toContain('The remaining timeline needs an unsafe calorie deficit.');
  expect([...host.querySelectorAll('button')].some(b=>b.textContent.includes('Confirm new version'))).toBe(false);
  expect(requests.filter(r=>r.url.endsWith('/revisions'))).toHaveLength(0);
});
test('shows the calendar tracking summary without a duplicate tracking form',async()=>{
  await act(async()=>root.render(<MealRoutinePanel plan={{...plan,routine:{...plan.routine,entries:plan.routine.entries.map(e=>({...e,status:'followed'}))}}} onPlanChanged={()=>{}} onEditProfile={()=>{}} />));
  expect(host.textContent).toContain('1 / 1');
  expect(host.textContent).toContain('100%');
  expect(host.textContent).toContain('Record meals directly on the calendar above.');
  expect(host.querySelector('#tracking-date, .wm-tracking-list')).toBeNull();
  expect(requests).toHaveLength(0);
});
