import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { vi } from 'vitest';
import WeeklyCalendar from './WeeklyCalendar';
import axios from '../../lib/axios';

const plan={id:20,startDate:'2026-10-17',endDate:'2026-10-23',menu:{days:[{dayIndex:1,date:'2026-10-17',totalCalories:600,meals:[{mealId:1,mealTime:'breakfast',name:'Tofu congee',calories:600,portionMultiplier:1,ingredients:[]}]}]},
  routine:{mode:'weight_goal',state:'active',version:3,timeZoneId:'UTC',entries:[{date:'2026-10-17',mealTime:'breakfast',status:'unlogged',dueAt:'2026-10-17T00:00:00Z'}]}};
let root,host,oldAdapter,requests,reply;
beforeEach(()=>{
  global.IS_REACT_ACT_ENVIRONMENT=true;host=document.createElement('div');document.body.appendChild(host);root=createRoot(host);
  oldAdapter=axios.defaults.adapter;requests=[];
  reply=async config=>({...plan.routine,version:4,entries:plan.routine.entries.map(e=>({...e,status:JSON.parse(config.data).status}))});
  axios.defaults.adapter=async config=>{requests.push(config);return {config,status:200,headers:{},data:await reply(config)};};
});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();axios.defaults.adapter=oldAdapter;vi.useRealTimers();});
function Harness({initial=plan}) { const [current,setCurrent]=useState(initial);return <WeeklyCalendar plan={current} onRoutineChanged={routine=>setCurrent(p=>({...p,routine}))} />; }
const render=(initial=plan)=>act(async()=>root.render(<Harness initial={initial} />));
const click=node=>act(async()=>node.click());
test('toggles a day meal between not recorded and followed without opening meal details',async()=>{
  await render();
  const followed=host.querySelector('.wm-day-view .wm-follow-button');
  expect(followed.textContent).toBe('Not recorded');
  expect(followed.getAttribute('aria-pressed')).toBe('false');
  expect(host.querySelector('.wm-meal-card button, .wm-meal-card select')).toBeNull();
  await click(followed);
  expect(requests[0].url).toBe('/MealPlans/20/tracking');
  expect(JSON.parse(requests[0].data)).toMatchObject({date:'2026-10-17',mealTime:'breakfast',status:'followed',expectedVersion:3});
  expect(followed.textContent).toBe('Followed');
  expect(followed.getAttribute('aria-pressed')).toBe('true');
  expect(host.querySelector('.wm-meal-detail')).toBeNull();
  await click(followed);
  expect(JSON.parse(requests[1].data)).toMatchObject({date:'2026-10-17',mealTime:'breakfast',status:'unlogged',expectedVersion:4});
  expect(followed.textContent).toBe('Not recorded');
  expect(followed.getAttribute('aria-pressed')).toBe('false');
});
test('failed save keeps the old status and shows the error on the calendar',async()=>{
  reply=async()=>{throw Object.assign(new Error('Conflict'),{response:{status:409,data:{message:'Reload before trying again.'}}});};
  await render();await click(host.querySelector('.wm-follow-button'));
  expect(host.textContent).toContain('Reload before trying again.');
  expect(host.querySelector('.wm-follow-button').getAttribute('aria-pressed')).toBe('false');
});
test('future and superseded meals cannot be tracked and maintenance has no tracking controls',async()=>{
  await render({...plan,routine:{...plan.routine,entries:plan.routine.entries.map(e=>({...e,dueAt:'2099-10-17T12:00:00Z'}))}});
  expect(host.querySelector('.wm-follow-button').disabled).toBe(true);
  expect(host.textContent).not.toContain('Available after your scheduled meal time.');
  await act(async()=>root.render(<WeeklyCalendar plan={{...plan,routine:{...plan.routine,state:'superseded'}}} onRoutineChanged={()=>{}} />));
  expect(host.querySelector('.wm-follow-button').disabled).toBe(true);
  await act(async()=>root.render(<WeeklyCalendar plan={{...plan,routine:null}} />));
  expect(host.querySelector('.wm-meal-tracking')).toBeNull();
});
test('week calendar uses the same two-state button without a combo box',async()=>{
  const original=window.matchMedia;window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  try {
    await render();await click([...host.querySelectorAll('button')].find(b=>b.textContent.includes('Week view')));
    const button=host.querySelector('[data-view="week"] .wm-follow-button');
    expect(button.textContent).toBe('Not recorded');
    expect(host.querySelector('[data-view="week"] .wm-meal-tracking select')).toBeNull();
    await click(button);
    expect(JSON.parse(requests[0].data)).toMatchObject({date:'2026-10-17',mealTime:'breakfast',status:'followed',expectedVersion:3});
    expect(button.textContent).toBe('Followed');
  } finally {window.matchMedia=original;}
});
