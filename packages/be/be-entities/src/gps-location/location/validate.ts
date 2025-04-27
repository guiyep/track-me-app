import * as z from 'zod';

export const validate = (data: unknown): void => {
  const gpsInfoSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    altitude: z.number(),
    accuracy: z.number(),
    altitudeAccuracy: z.number(),
    heading: z.number(),
    speed: z.number(),
  });

  const wifiSignalInfoSchema = z.object({
    type: z.literal('wifi'),
    isConnected: z.boolean(),
    strength: z.number(),
    frequency: z.number(),
  });

  const cellularSignalInfoSchema = z.object({
    type: z.literal('cellular'),
    isConnected: z.boolean(),
    isInternetReachable: z.boolean(),
    cellularGeneration: z.enum(['3g', '4g', '5g']),
    carrier: z.string(),
    isConnectionExpensive: z.boolean(),
    strength: z.number(),
  });

  const signalInfoSchema = z.discriminatedUnion('type', [
    wifiSignalInfoSchema,
    cellularSignalInfoSchema,
  ]);

  const batteryInfoSchema = z.object({
    batteryLevel: z.number().min(0).max(100),
    batteryState: z.enum(['charging', 'discharging', 'full']),
    chargingSource: z.enum(['AC', 'USB', 'wireless', 'unknown']).optional(),
    chargingStatus: z.boolean(),
    batteryHealth: z.enum(['good', 'poor', 'unknown']).optional(),
  });

  const schema = z.object({
    userId: z.string(),
    sessionId: z.string().min(1),
    lat: z.number().refine((val) => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    long: z.number().refine((val) => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
    gpsInfo: gpsInfoSchema,
    signalInfo: signalInfoSchema,
    batteryInfo: batteryInfoSchema,
  });

  schema.parse(data);
};
