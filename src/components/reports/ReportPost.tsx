// src/components/reports/ReportPost.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

import { MapPin, Image as ImageIcon, User, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpvotes } from '@/hooks/useUpvotes';
import type { ReportItem } from '@/types/report';
import { URGENCY_COLOR, URGENCY_LABEL } from '@/lib/constants';

interface ReportPostProps {
  report: ReportItem;
}

export function ReportPost({ report }: ReportPostProps) {
  const router = useRouter();

  const timeAgo = formatDistanceToNow(new Date(report.createdAt), {
    addSuffix: true,
    locale: idLocale,
  });

  const initialVoted = !!(report.upvotes && report.upvotes.length > 0);
  const initialCount = report.upvoteCount || 0;
  const upvotes = useUpvotes({
    [report.id]: { count: initialCount, hasVoted: initialVoted },
  });

  const currentUpvoteCount = upvotes.getCount(report.id);
  const hasVoted = upvotes.hasVoted(report.id);

  return (
    <article
      className='bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm h-full group cursor-pointer transition-colors hover:border-primary/50'
      onClick={() => router.push(`/dashboard/reports/${report.id}`)}
    >
      {/* ── Image — free ratio on mobile, fixed 4:3 on sm+ grid ── */}
      <div className='relative w-full overflow-hidden bg-muted'>
        {report.imageUrl ? (
          <div className='relative w-full sm:aspect-4/3 max-sm:min-h-40'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.imageUrl}
              alt={report.title}
              className='w-full h-auto sm:absolute sm:inset-0 sm:h-full object-contain sm:object-cover transition-transform duration-300 group-hover:scale-[1.02]'
              loading='lazy'
            />
          </div>
        ) : (
          <div className='w-full aspect-4/3 flex flex-col items-center justify-center text-muted-foreground/30 gap-2'>
            <ImageIcon className='w-10 h-10' />
            <span className='text-xs font-medium'>Tidak ada foto</span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className='flex flex-col grow p-3 sm:p-4 gap-3'>
        {/* Author row */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden'>
              {report.author?.image ? (
                <Image
                  src={report.author.image}
                  alt='Avatar'
                  width={28}
                  height={28}
                  className='w-full h-full object-cover'
                />
              ) : (
                <User className='w-3.5 h-3.5 text-muted-foreground' />
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-xs font-semibold text-foreground leading-tight truncate'>
                {report.author?.name || 'Warga Anonim'}
              </p>
              <p className='text-[10px] text-muted-foreground'>{timeAgo}</p>
            </div>
          </div>

          {/* Urgency chip */}
          <span
            className={cn(
              'shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border',
              URGENCY_COLOR[report.urgency] ?? URGENCY_COLOR.low,
            )}
          >
            Kerusakan {URGENCY_LABEL[report.urgency] ?? report.urgency}
          </span>
        </div>

        {/* Title + description */}
        <div className='grow'>
          <p className='text-sm font-bold text-foreground leading-snug mb-1 line-clamp-2'>
            {report.title}
          </p>
          <p className='text-xs text-muted-foreground line-clamp-3 leading-relaxed'>
            {report.description || 'Tidak ada deskripsi.'}
          </p>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between pt-2.5 border-t border-border/50 gap-2'>
          {/* Location */}
          <div className='flex items-center gap-1 text-[11px] text-primary font-medium min-w-0'>
            <MapPin className='w-3 h-3 shrink-0' />
            <span className='truncate'>{report.kota}</span>
            <span className='text-muted-foreground shrink-0'>
              · #{report.category}
            </span>
          </div>

          {/* Upvote */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Mencegah klik tombol upvote memicu router.push pada <article>
              upvotes.toggle(report.id);
            }}
            aria-label={`Dukung laporan. ${currentUpvoteCount} dukungan`}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 shrink-0',
              hasVoted
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30',
            )}
          >
            <ThumbsUp
              className={cn(
                'w-3.5 h-3.5 transition-all',
                hasVoted && 'fill-current',
              )}
            />
            <span className='text-xs font-bold tabular-nums'>
              {currentUpvoteCount}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
