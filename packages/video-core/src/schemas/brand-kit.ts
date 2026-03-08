import { z } from 'zod';

export const BrandKitSchema = z.object({
  logoUrl: z.string().optional(),
  logoPlacement: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']).default('top-right'),
  primaryColor: z.string().default('#6366f1'),
  secondaryColor: z.string().default('#a5b4fc'),
  accentColor: z.string().default('#f59e0b'),
  backgroundColor: z.string().default('#0f172a'),
  textColor: z.string().default('#f8fafc'),
  fontHeading: z.string().default('Inter'),
  fontBody: z.string().default('Inter'),
});

export type BrandKit = z.infer<typeof BrandKitSchema>;
