import * as heartbeatData from '@/mock/heartbeat.json';

export async function fetchHeartBeatData() {
  return new Promise((resolve, reject) => {
    try {
      const subSamples = heartbeatData.SubSamples;
      const bpm = subSamples.length;
      resolve(bpm);
    } catch (error) {
      reject(error);
    }
  });
}

export function isHeartBeatTooHigh(bpm: number, age: number) {
  return 192 - (0.007 * age ^ 2) <= bpm;
}