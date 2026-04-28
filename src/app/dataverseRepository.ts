import {
  Crc07_pssr_approvalsService,
  Crc07_pssr_checklist_questionsService,
  Crc07_pssr_checklistsService,
  Crc07_pssr_deficienciesService,
  Crc07_pssr_mocsService,
  Crc07_pssr_plansService,
  Crc07_pssr_projectsService,
  Crc07_pssr_tarevisionsService,
  Crc07_pssr_team_membersService,
  Crc07_pssr_template_checklistsService,
  Crc07_pssr_template_questionsService,
} from '../generated';
import {
  Crc07_pssr_approvalscrc07_pssrstage,
  Crc07_pssr_approvalscrc07_role,
  Crc07_pssr_approvalscrc07_status,
} from '../generated/models/Crc07_pssr_approvalsModel';
import { Crc07_pssr_checklist_questionscrc07_response } from '../generated/models/Crc07_pssr_checklist_questionsModel';
import {
  Crc07_pssr_checklistscrc07_discipline,
  Crc07_pssr_checklistscrc07_status,
} from '../generated/models/Crc07_pssr_checklistsModel';
import {
  Crc07_pssr_deficienciescrc07_acceptedcategory,
  Crc07_pssr_deficienciescrc07_initialcategory,
  Crc07_pssr_deficienciescrc07_status,
} from '../generated/models/Crc07_pssr_deficienciesModel';
import {
  Crc07_pssr_planscrc07_pssrstage,
  Crc07_pssr_planscrc07_site,
  Crc07_pssr_planscrc07_type,
} from '../generated/models/Crc07_pssr_plansModel';
import {
  Systemuserscrc07_role,
  Systemuserscrc07_site,
} from '../generated/models/SystemusersModel';
import { Crc07_pssr_team_memberscrc07_roles } from '../generated/models/Crc07_pssr_team_membersModel';
import {
  Crc07_pssr_template_checklistscrc07_discipline,
  Crc07_pssr_template_checklistscrc07_site,
} from '../generated/models/Crc07_pssr_template_checklistsModel';
import { Crc07_pssr_template_questionscrc07_site } from '../generated/models/Crc07_pssr_template_questionsModel';
import type { IGetAllOptions } from '../generated/models/CommonModels';
import type {
  ApprovalVm,
  ChecklistVm,
  CurrentUserProfileVm,
  DeficiencyVm,
  PlanVm,
  QuestionVm,
  TeamMemberVm,
  TemplateChecklistVm,
  TemplateQuestionVm,
} from './types';
import { getClient } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../.power/schemas/appschemas/dataSourcesInfo';

const MAX_RETRY_ATTEMPTS = 3;
const READ_TIMEOUT_MS = 12000;
const dataverseClient = getClient(dataSourcesInfo);

type OperationResultLike<T> = {
  success?: boolean;
  data: T;
  error?: unknown;
};

type SystemUserRow = {
  systemuserid?: string;
  fullname?: string;
  internalemailaddress?: string;
  isdisabled?: boolean;
  azureactivedirectoryobjectid?: string;
  crc07_role?: number;
  crc07_rolename?: string;
  crc07_site?: number;
  crc07_sitename?: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function withReadTimeout<T>(operation: Promise<T>, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, READ_TIMEOUT_MS);

    operation
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function getErrorDetail(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const detailSource = error as Record<string, unknown>;
    const nestedMessage = detailSource.message
      ?? detailSource.errorMessage
      ?? detailSource.description
      ?? detailSource.details;

    if (typeof nestedMessage === 'string' && nestedMessage.trim().length > 0) {
      return nestedMessage;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown Dataverse error object';
    }
  }

  return 'Unknown Dataverse error';
}

function getResultData<T>(result: OperationResultLike<T>, operationName: string): T {
  if (result.success === false) {
    const detail = getErrorDetail(result.error);
    throw new Error(`${operationName} failed. ${detail}`);
  }

  return result.data;
}

async function readDataverseRows<T>(
  operation: Promise<OperationResultLike<T[] | undefined>>,
  timeoutMessage: string,
  operationName: string,
): Promise<T[]> {
  const result = await withReadTimeout(operation, timeoutMessage);
  return getResultData(result, operationName) ?? [];
}

async function withMutationRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= MAX_RETRY_ATTEMPTS - 1) {
        break;
      }
      await delay(250 * (2 ** attempt));
    }
  }
  throw lastError;
}

function lookupName<T extends number>(lookup: Record<T, string>, value?: number): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return lookup[value as T];
}

function normalizeQuestionResponseCode(value?: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return lookupName(Crc07_pssr_checklist_questionscrc07_response, value) !== undefined
    ? value
    : undefined;
}

function normalizeChoiceCode(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function getApprovalDecisionLabel(value?: number, label?: string): string {
  return normalizeStatusLabel(label ?? lookupName(Crc07_pssr_approvalscrc07_status, value), value !== undefined ? 'In Progress' : undefined);
}

function normalizeStatusLabel(label?: string, fallback?: string): string {
  const normalizedLabel = (label ?? '').trim();

  if (!normalizedLabel) {
    return fallback ?? 'In Progress';
  }

  const compactLabel = normalizedLabel.replace(/[\s_-]+/g, '').toLowerCase();

  if (compactLabel === 'inprogress') {
    return 'In Progress';
  }

  if (compactLabel === 'notstarted') {
    return 'Not Started';
  }

  return normalizedLabel;
}

function inferApprovalRoleLabel(input: {
  roleLabel?: string;
  stageCode?: number;
  decisionCode?: number;
  comment?: string;
  memberId?: string;
}): string | undefined {
  if (input.roleLabel?.trim()) {
    return input.roleLabel.trim();
  }

  const comment = (input.comment ?? '').trim().toLowerCase();
  if (
    input.stageCode === 507650000
    && input.decisionCode === 507650002
    && (Boolean(input.memberId) || comment.includes('originator'))
  ) {
    return 'Originator';
  }

  return undefined;
}

function normalizeApprovalDecisionCode(value: unknown): number | undefined {
  return normalizeChoiceCode(value);
}

function normalizeGuid(value?: string): string {
  return (value ?? '').replace(/[{}]/g, '').toLowerCase();
}

function normalizeKey(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

export async function getPlans(): Promise<PlanVm[]> {
  let planRows: Awaited<ReturnType<typeof Crc07_pssr_plansService.getAll>>['data'] = [];
  let lastPlanError: unknown;
  const planQueryAttempts: Array<Parameters<typeof Crc07_pssr_plansService.getAll>[0]> = [
    {
      select: [
        'crc07_pssr_planid',
        'crc07_planid',
        'crc07_name',
        'crc07_event',
        'crc07_site',
        'crc07_type',
        'crc07_pssrstage',
        'crc07_system',
        'crc07_mocname',
        'crc07_projectname',
        'crc07_tarevisionname',
        '_createdby_value',
      ],
      top: 5000,
    },
    {
      filter: '(statecode eq 0) or (statecode eq 1)',
      top: 5000,
    },
    undefined,
  ];

  for (const options of planQueryAttempts) {
    try {
      const result = await withReadTimeout(
        Crc07_pssr_plansService.getAll(options),
        'Timed out loading plans from Dataverse.',
      );
      planRows = getResultData(result, 'Loading plans from Dataverse');
      if (planRows.length > 0) {
        break;
      }
    } catch (error) {
      lastPlanError = error;
    }
  }

  if (planRows.length === 0 && lastPlanError) {
    throw lastPlanError;
  }

  const [checklistsOutcome, deficienciesOutcome] = await Promise.allSettled([
    withReadTimeout(
      Crc07_pssr_checklistsService.getAll({
        select: [
          'crc07_pssr_checklistid',
          'crc07_checklistname',
          'crc07_discipline',
          'crc07_status',
          '_crc07_relatedplan_value',
        ],
        top: 5000,
        orderBy: ['modifiedon desc'],
      }),
      'Timed out loading checklist metrics from Dataverse.',
    ),
    withReadTimeout(
      Crc07_pssr_deficienciesService.getAll({
        select: ['crc07_pssr_deficiencyid', '_crc07_relatedplan_value', 'crc07_status'],
        top: 5000,
      }),
      'Timed out loading deficiency metrics from Dataverse.',
    ),
  ]);

  const checklistRows = checklistsOutcome.status === 'fulfilled'
    ? (() => {
      try {
        return getResultData(
          checklistsOutcome.value,
          'Loading checklist metrics from Dataverse',
        );
      } catch {
        return [];
      }
    })()
    : [];
  const deficiencyRows = deficienciesOutcome.status === 'fulfilled'
    ? (() => {
      try {
        return getResultData(
          deficienciesOutcome.value,
          'Loading deficiency metrics from Dataverse',
        );
      } catch {
        return [];
      }
    })()
    : [];

  const planIdsByAlias = new Map<string, string>();
  for (const plan of planRows) {
    const planRecordId = normalizeGuid(plan.crc07_pssr_planid);
    const planAliases = [plan.crc07_planid, plan.crc07_name]
      .map((value) => normalizeKey(value))
      .filter((value) => value.length > 0);

    if (!planRecordId) {
      continue;
    }

    for (const alias of planAliases) {
      planIdsByAlias.set(alias, planRecordId);
    }
  }

  const resolvePlanRecordId = (relatedPlanValue?: string, relatedPlanName?: string): string => {
    const relatedPlanId = normalizeGuid(relatedPlanValue);
    if (relatedPlanId) {
      return relatedPlanId;
    }

    return planIdsByAlias.get(normalizeKey(relatedPlanName)) ?? '';
  };

  const checklistBuckets = new Map<string, { total: number; completed: number }>();
  for (const item of checklistRows) {
    const planId = resolvePlanRecordId(item._crc07_relatedplan_value, item.crc07_relatedplanname);
    if (!planId) {
      continue;
    }
    const existing = checklistBuckets.get(planId) ?? { total: 0, completed: 0 };
    existing.total += 1;
    if ((item.crc07_status as number | undefined) === 507650002) {
      existing.completed += 1;
    }
    checklistBuckets.set(planId, existing);
  }

  const openDefBuckets = new Map<string, number>();
  for (const item of deficiencyRows) {
    const planId = resolvePlanRecordId(item._crc07_relatedplan_value, item.crc07_relatedplanname);
    if (!planId) {
      continue;
    }
    const current = openDefBuckets.get(planId) ?? 0;
    const status = item.crc07_status as number | undefined;
    if (status !== 507650002) {
      openDefBuckets.set(planId, current + 1);
    }
  }

  const zeroChecklistPlans = planRows.filter((plan) => {
    const planRecordId = normalizeGuid(plan.crc07_pssr_planid);
    return Boolean(planRecordId) && (checklistBuckets.get(planRecordId)?.total ?? 0) === 0;
  });

  if (zeroChecklistPlans.length > 0) {
    const checklistFallbacks = await Promise.allSettled(
      zeroChecklistPlans.map(async (plan) => {
        const planRecordId = normalizeGuid(plan.crc07_pssr_planid);
        const planAliases = Array.from(new Set([
          plan.crc07_planid?.trim(),
          plan.crc07_name?.trim(),
        ].filter((value): value is string => Boolean(value && value.trim().length > 0))));

        if (!planRecordId || planAliases.length === 0) {
          return undefined;
        }

        const fallbackPromises = planAliases.map((alias) =>
          readDataverseRows(
            Crc07_pssr_checklistsService.getAll({
              select: ['crc07_pssr_checklistid', 'crc07_status'],
              filter: `crc07_relatedplanname eq '${escapeODataString(alias)}'`,
              top: 5000,
            }),
            `Timed out loading checklist fallback metrics for plan alias ${alias}.`,
            `Loading checklist fallback metrics for plan alias ${alias}`
          ).catch(() => [] as any[])
        );

        fallbackPromises.push(
          readDataverseRows(
            Crc07_pssr_checklistsService.getAll({
              select: ['crc07_pssr_checklistid', 'crc07_status'],
              filter: `_crc07_relatedplan_value eq ${planRecordId}`,
              top: 5000,
            }),
            `Timed out loading checklist fallback metrics for plan GUID.`,
            `Loading checklist fallback metrics for plan GUID`
          ).catch(() => [] as any[])
        );

        const fallbackResults = await Promise.all(fallbackPromises);
        const fallbackRows = fallbackResults.flat();

        const seenChecklistIds = new Set<string>();
        const fallbackStats = fallbackRows.reduce(
          (stats, item) => {
            const checklistId = normalizeGuid(item.crc07_pssr_checklistid);
            if (checklistId) {
              if (seenChecklistIds.has(checklistId)) {
                return stats;
              }
              seenChecklistIds.add(checklistId);
            }

            stats.total += 1;
            if ((item.crc07_status as number | undefined) === 507650002) {
              stats.completed += 1;
            }
            return stats;
          },
          { total: 0, completed: 0 },
        );

        return fallbackStats.total > 0
          ? { planRecordId, stats: fallbackStats }
          : undefined;
      }),
    );

    for (const result of checklistFallbacks) {
      if (result.status === 'fulfilled' && result.value) {
        checklistBuckets.set(result.value.planRecordId, result.value.stats);
      }
    }
  }

  return planRows.map((plan) => {
    const id = normalizeGuid(plan.crc07_pssr_planid);
    const checklistStats = checklistBuckets.get(id) ?? { total: 0, completed: 0 };
    const percentComplete = checklistStats.total === 0
      ? 0
      : Math.round((checklistStats.completed / checklistStats.total) * 100);

    return {
      id,
      createdById: normalizeGuid(plan._createdby_value),
      planId: plan.crc07_planid ?? id,
      name: plan.crc07_name ?? 'Untitled Plan',
      event: plan.crc07_event,
      siteCode: plan.crc07_site as number | undefined,
      siteLabel: plan.crc07_sitename ?? lookupName(Crc07_pssr_planscrc07_site, plan.crc07_site as number | undefined),
      typeCode: plan.crc07_type as number | undefined,
      typeLabel: plan.crc07_typename ?? lookupName(Crc07_pssr_planscrc07_type, plan.crc07_type as number | undefined),
      stageCode: plan.crc07_pssrstage as number | undefined,
      stageLabel: plan.crc07_pssrstagename ?? lookupName(Crc07_pssr_planscrc07_pssrstage, plan.crc07_pssrstage as number | undefined),
      system: plan.crc07_system,
      mocName: plan.crc07_mocname,
      projectName: plan.crc07_projectname,
      taRevisionName: plan.crc07_tarevisionname,
      checklistCompletedCount: checklistStats.completed,
      checklistTotalCount: checklistStats.total,
      percentComplete,
      openDeficiencyCount: openDefBuckets.get(id) ?? 0,
    };
  });
}

export async function createPlan(payload: {
  name: string;
  event?: string;
  siteCode?: number;
  typeCode?: number;
  stageCode?: number;
  system?: string;
  mocId?: string;
  projectId?: string;
  taRevisionId?: string;
}): Promise<void> {
  const createPayload: {
    crc07_name: string;
    crc07_event?: string;
    crc07_site?: never;
    crc07_type?: never;
    crc07_pssrstage?: never;
    crc07_system?: string;
    'crc07_MoC@odata.bind'?: string;
    'crc07_Project@odata.bind'?: string;
    'crc07_TARevision@odata.bind'?: string;
  } = {
    crc07_name: payload.name,
    crc07_event: payload.event,
    crc07_site: payload.siteCode as never,
    crc07_type: payload.typeCode as never,
    crc07_pssrstage: payload.stageCode as never,
    crc07_system: payload.system,
  };

  if (payload.mocId) {
    createPayload['crc07_MoC@odata.bind'] = `/crc07_pssr_mocs(${normalizeGuid(payload.mocId)})`;
  }
  if (payload.projectId) {
    createPayload['crc07_Project@odata.bind'] = `/crc07_pssr_projects(${normalizeGuid(payload.projectId)})`;
  }
  if (payload.taRevisionId) {
    createPayload['crc07_TARevision@odata.bind'] = `/crc07_pssr_tarevisions(${normalizeGuid(payload.taRevisionId)})`;
  }

  await withMutationRetry(async () => {
    await Crc07_pssr_plansService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_plansService.create>[0]);
  });
}

export async function updatePlan(planId: string, payload: {
  name?: string;
  event?: string;
  siteCode?: number;
  typeCode?: number;
  stageCode?: number;
  system?: string;
}): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_plansService.update(planId, {
      crc07_name: payload.name,
      crc07_event: payload.event,
      crc07_site: payload.siteCode as never,
      crc07_type: payload.typeCode as never,
      crc07_pssrstage: payload.stageCode as never,
      crc07_system: payload.system,
    });
  });
}

export type PlanLookupOptionVm = {
  id: string;
  label: string;
};

export async function getMocLookupOptions(): Promise<PlanLookupOptionVm[]> {
  const result = await withReadTimeout(
    Crc07_pssr_mocsService.getAll({
      select: ['crc07_pssr_mocid', 'crc07_mocno'],
      top: 5000,
      orderBy: ['modifiedon desc'],
    }),
    'Timed out loading MOC lookup options from Dataverse.',
  );

  const rows = getResultData(result, 'Loading MOC lookup options from Dataverse');
  return rows
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_mocid),
      label: item.crc07_mocno,
    }))
    .filter((item) => Boolean(item.id) && Boolean(item.label));
}

export async function getProjectLookupOptions(): Promise<PlanLookupOptionVm[]> {
  const result = await withReadTimeout(
    Crc07_pssr_projectsService.getAll({
      select: ['crc07_pssr_projectid', 'crc07_projectno'],
      top: 5000,
      orderBy: ['modifiedon desc'],
    }),
    'Timed out loading Project lookup options from Dataverse.',
  );

  const rows = getResultData(result, 'Loading Project lookup options from Dataverse');
  return rows
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_projectid),
      label: item.crc07_projectno,
    }))
    .filter((item) => Boolean(item.id) && Boolean(item.label));
}

export async function getTaRevisionLookupOptions(): Promise<PlanLookupOptionVm[]> {
  const result = await withReadTimeout(
    Crc07_pssr_tarevisionsService.getAll({
      select: ['crc07_pssr_tarevisionid', 'crc07_tasaprevision'],
      top: 5000,
      orderBy: ['modifiedon desc'],
    }),
    'Timed out loading TA Revision lookup options from Dataverse.',
  );

  const rows = getResultData(result, 'Loading TA Revision lookup options from Dataverse');
  return rows
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_tarevisionid),
      label: item.crc07_tasaprevision,
    }))
    .filter((item) => Boolean(item.id) && Boolean(item.label));
}

export async function getUserLookupOptions(): Promise<PlanLookupOptionVm[]> {
  const result = await withReadTimeout(
    dataverseClient.retrieveMultipleRecordsAsync<SystemUserRow>('systemusers', {
      select: ['systemuserid', 'fullname', 'internalemailaddress', 'isdisabled'],
      filter: 'isdisabled eq false',
      orderBy: ['fullname asc'],
      top: 5000,
    } as IGetAllOptions),
    'Timed out loading user lookup options from Dataverse.',
  );

  const rows = getResultData(result as OperationResultLike<SystemUserRow[]>, 'Loading user lookup options from Dataverse');
  return (rows ?? [])
    .filter((item) => !item.isdisabled)
    .map((item) => ({
      id: normalizeGuid(item.systemuserid),
      label: item.fullname?.trim() || item.internalemailaddress?.trim() || '',
    }))
    .filter((item) => Boolean(item.id) && Boolean(item.label));
}

export async function getCurrentUserProfile(criteria: {
  objectId?: string;
  userPrincipalName?: string;
  fallbackFullName?: string;
}): Promise<CurrentUserProfileVm | undefined> {
  const result = await withReadTimeout(
    dataverseClient.retrieveMultipleRecordsAsync<SystemUserRow>('systemusers', {
      select: [
        'systemuserid',
        'fullname',
        'internalemailaddress',
        'isdisabled',
        'azureactivedirectoryobjectid',
        'crc07_role',
        'crc07_site',
      ],
      filter: 'isdisabled eq false',
      orderBy: ['fullname asc'],
      top: 5000,
    } as IGetAllOptions),
    'Timed out loading current user profile from Dataverse.',
  );

  const rows = getResultData(result as OperationResultLike<SystemUserRow[]>, 'Loading current user profile from Dataverse') ?? [];
  const normalizedObjectId = normalizeGuid(criteria.objectId);
  const normalizedUpn = normalizeKey(criteria.userPrincipalName);

  const matchedUser = rows.find((item) => {
    if (item.isdisabled) {
      return false;
    }

    const objectIdMatches = Boolean(normalizedObjectId)
      && normalizeGuid(item.azureactivedirectoryobjectid) === normalizedObjectId;
    const upnMatches = Boolean(normalizedUpn)
      && normalizeKey(item.internalemailaddress) === normalizedUpn;

    return objectIdMatches || upnMatches;
  });

  if (!matchedUser) {
    return undefined;
  }

  return {
    systemUserId: normalizeGuid(matchedUser.systemuserid),
    fullName: matchedUser.fullname?.trim() || criteria.fallbackFullName?.trim() || 'Unknown user',
    userPrincipalName: matchedUser.internalemailaddress?.trim() || criteria.userPrincipalName?.trim() || '',
    roleLabel: matchedUser.crc07_rolename ?? lookupName(Systemuserscrc07_role, matchedUser.crc07_role),
    siteLabel: matchedUser.crc07_sitename ?? lookupName(Systemuserscrc07_site, matchedUser.crc07_site),
  };
}

export async function getPlanChecklists(planId: string): Promise<ChecklistVm[]> {
  const rowsPromise = readDataverseRows(
    Crc07_pssr_checklistsService.getAll({
    select: [
      'crc07_pssr_checklistid',
      'crc07_checklistid',
      'crc07_checklistname',
      'crc07_discipline',
      'crc07_status',
      '_crc07_relatedplan_value',
    ],
    top: 5000,
    orderBy: ['modifiedon desc'],
    }),
    'Timed out loading plan checklists from Dataverse.',
    'Loading plan checklists from Dataverse',
  );

  const questionsPromise = readDataverseRows(
    Crc07_pssr_checklist_questionsService.getAll({
      select: ['crc07_pssr_checklist_questionid', 'crc07_response', '_crc07_relatedchecklist_value'],
      top: 5000,
    }),
    'Timed out loading checklist questions from Dataverse.',
    'Loading checklist questions from Dataverse',
  );

  const [rows, questions] = await Promise.all([rowsPromise, questionsPromise]);

  const targetPlanId = normalizeGuid(planId);

  const questionTotalCounts = new Map<string, number>();
  const questionCompletedCounts = new Map<string, number>();

  for (const question of questions) {
    const checklistId = normalizeGuid(question._crc07_relatedchecklist_value);
    const responseCode = normalizeQuestionResponseCode(question.crc07_response as number | undefined);
    
    questionTotalCounts.set(checklistId, (questionTotalCounts.get(checklistId) ?? 0) + 1);
    if (responseCode !== undefined) {
      questionCompletedCounts.set(checklistId, (questionCompletedCounts.get(checklistId) ?? 0) + 1);
    }
  }

  return rows
    .filter((item) => normalizeGuid(item._crc07_relatedplan_value) === targetPlanId)
    .map((item) => {
      const id = normalizeGuid(item.crc07_pssr_checklistid);
      return {
        id,
        checklistId: item.crc07_checklistid,
        name: item.crc07_checklistname ?? 'Checklist',
        disciplineCode: item.crc07_discipline as number | undefined,
        disciplineLabel: item.crc07_disciplinename ?? lookupName(Crc07_pssr_checklistscrc07_discipline, item.crc07_discipline as number | undefined),
        statusCode: item.crc07_status as number | undefined,
        statusLabel: normalizeStatusLabel(
          item.crc07_statusname ?? lookupName(Crc07_pssr_checklistscrc07_status, item.crc07_status as number | undefined),
          item.crc07_status !== undefined ? 'In Progress' : undefined,
        ),
        planId: normalizeGuid(item._crc07_relatedplan_value),
        questionTotalCount: questionTotalCounts.get(id) ?? 0,
        questionCompletedCount: questionCompletedCounts.get(id) ?? 0,
      };
    });
}

export async function createChecklistFromPlan(planId: string, payload: {
  name: string;
  disciplineCode?: number;
  statusCode?: number;
}): Promise<string> {
  const createPayload = {
    crc07_checklistname: payload.name,
    crc07_discipline: payload.disciplineCode as never,
    crc07_status: payload.statusCode as never,
    'crc07_RelatedPlan@odata.bind': `/crc07_pssr_plans(${planId})`,
  };

  const result = await withMutationRetry(async () => {
    return Crc07_pssr_checklistsService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_checklistsService.create>[0]);
  });

  return normalizeGuid(result.data?.crc07_pssr_checklistid ?? '');
}

export async function getChecklistQuestions(checklistId: string): Promise<QuestionVm[]> {
  const rows = await readDataverseRows(
    Crc07_pssr_checklist_questionsService.getAll({
    select: [
      'crc07_pssr_checklist_questionid',
      'crc07_questiontext',
      'crc07_ismandatory',
      'crc07_sequenceorder',
      'crc07_response',
      '_crc07_relatedchecklist_value',
    ],
    top: 5000,
    orderBy: ['crc07_sequenceorder asc'],
    }),
    'Timed out loading checklist questions from Dataverse.',
    'Loading checklist questions from Dataverse',
  );

  const targetChecklistId = normalizeGuid(checklistId);
  return rows
    .filter((item) => normalizeGuid(item._crc07_relatedchecklist_value) === targetChecklistId)
    .map((item) => {
      const responseCode = normalizeQuestionResponseCode(item.crc07_response as number | undefined);

      return {
        id: normalizeGuid(item.crc07_pssr_checklist_questionid),
        checklistId: normalizeGuid(item._crc07_relatedchecklist_value),
        text: item.crc07_questiontext ?? 'Question',
        required: Boolean(item.crc07_ismandatory),
        sequenceOrder: item.crc07_sequenceorder ?? 0,
        responseCode,
        responseLabel: item.crc07_responsename ?? lookupName(Crc07_pssr_checklist_questionscrc07_response, responseCode),
        comment: '',
      };
    });
}

export async function updateQuestionResponse(questionId: string, payload: {
  responseCode?: number;
}): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_checklist_questionsService.update(questionId, {
      crc07_response: payload.responseCode as never,
    });
  });
}

export async function getDeficienciesByPlan(planId: string): Promise<DeficiencyVm[]> {
  let rows: Awaited<ReturnType<typeof Crc07_pssr_deficienciesService.getAll>>['data'] = [];
  const deficiencyQueryAttempts: Array<Parameters<typeof Crc07_pssr_deficienciesService.getAll>[0]> = [
    {
      select: [
        'crc07_pssr_deficiencyid',
        'crc07_deficiencyid',
        'crc07_deficiencyname',
        'crc07_initialcategory',
        'crc07_acceptedcategory',
        'crc07_status',
        'crc07_generalcomment',
        'crc07_closeoutcomment',
        'crc07_closedon',
        '_crc07_closed_by_value',
        '_crc07_relatedplan_value',
        '_crc07_relatedchecklist_value',
        '_crc07_relatedquestion_value',
      ],
      top: 5000,
      orderBy: ['modifiedon desc'],
    },
    {
      top: 5000,
      orderBy: ['modifiedon desc'],
    },
  ];

  for (const options of deficiencyQueryAttempts) {
    const nextRows = await readDataverseRows(
      Crc07_pssr_deficienciesService.getAll(options),
      'Timed out loading deficiencies from Dataverse.',
      'Loading deficiencies from Dataverse',
    );

    rows = nextRows;
    if (nextRows.length === 0 || nextRows.some((item) => Boolean(item.crc07_deficiencyid?.trim()))) {
      break;
    }
  }

  const targetPlanId = normalizeGuid(planId);
  const planRows = rows.filter((item) => normalizeGuid(item._crc07_relatedplan_value) === targetPlanId);
  const checklists = await getPlanChecklists(planId);
  const checklistById = new Map(checklists.map((item) => [item.id, item]));
  const deficiencyQuestionIds = new Set(
    planRows
      .map((item) => normalizeGuid(item._crc07_relatedquestion_value))
      .filter((value) => Boolean(value)),
  );
  const questionRows = deficiencyQuestionIds.size > 0
    ? await readDataverseRows(
      Crc07_pssr_checklist_questionsService.getAll({
        select: [
          'crc07_pssr_checklist_questionid',
          'crc07_checklistquestionid',
          'crc07_questiontext',
          '_crc07_relatedchecklist_value',
        ],
        top: 5000,
        orderBy: ['crc07_sequenceorder asc'],
      }),
      'Timed out loading checklist questions from Dataverse.',
      'Loading checklist questions from Dataverse',
    )
    : [];
  const questionById = new Map(
    questionRows
      .filter((item) => deficiencyQuestionIds.has(normalizeGuid(item.crc07_pssr_checklist_questionid)))
      .map((item) => [normalizeGuid(item.crc07_pssr_checklist_questionid), item]),
  );

  return planRows
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_deficiencyid),
      deficiencyId: item.crc07_deficiencyid,
      name: item.crc07_deficiencyname ?? 'Deficiency',
      initialCategoryCode: normalizeChoiceCode(item.crc07_initialcategory),
      initialCategoryLabel: item.crc07_initialcategoryname ?? lookupName(Crc07_pssr_deficienciescrc07_initialcategory, normalizeChoiceCode(item.crc07_initialcategory)),
      acceptedCategoryCode: normalizeChoiceCode(item.crc07_acceptedcategory),
      acceptedCategoryLabel: item.crc07_acceptedcategoryname ?? lookupName(Crc07_pssr_deficienciescrc07_acceptedcategory, normalizeChoiceCode(item.crc07_acceptedcategory)),
      statusCode: normalizeChoiceCode(item.crc07_status),
      statusLabel: normalizeStatusLabel(
        item.crc07_statusname ?? lookupName(Crc07_pssr_deficienciescrc07_status, normalizeChoiceCode(item.crc07_status)),
        normalizeChoiceCode(item.crc07_status) !== undefined ? 'In Progress' : undefined,
      ),
      generalComment: item.crc07_generalcomment,
      closeoutComment: item.crc07_closeoutcomment,
      closedById: normalizeGuid(item._crc07_closed_by_value),
      closedOn: item.crc07_closedon,
      planId: normalizeGuid(item._crc07_relatedplan_value),
      checklistId: normalizeGuid(item._crc07_relatedchecklist_value),
      checklistName: checklistById.get(normalizeGuid(item._crc07_relatedchecklist_value))?.name ?? item.crc07_relatedchecklistname,
      questionId: normalizeGuid(item._crc07_relatedquestion_value),
      questionName: questionById.get(normalizeGuid(item._crc07_relatedquestion_value))?.crc07_questiontext ?? item.crc07_relatedquestionname,
    }));
}

export async function createDeficiency(payload: {
  planId: string;
  checklistId?: string;
  questionId?: string;
  name: string;
  initialCategoryCode?: number;
  acceptedCategoryCode?: number;
  statusCode?: number;
  generalComment?: string;
}): Promise<void> {
  const createPayload = {
    crc07_deficiencyname: payload.name,
    crc07_initialcategory: payload.initialCategoryCode as never,
    crc07_acceptedcategory: payload.acceptedCategoryCode as never,
    crc07_status: payload.statusCode as never,
    crc07_generalcomment: payload.generalComment,
    'crc07_RelatedPlan@odata.bind': `/crc07_pssr_plans(${payload.planId})`,
    'crc07_RelatedChecklist@odata.bind': payload.checklistId ? `/crc07_pssr_checklists(${payload.checklistId})` : undefined,
    'crc07_RelatedQuestion@odata.bind': payload.questionId ? `/crc07_pssr_checklist_questions(${payload.questionId})` : undefined,
  };

  await withMutationRetry(async () => {
    await Crc07_pssr_deficienciesService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_deficienciesService.create>[0]);
  });
}

export async function updateDeficiency(deficiencyId: string, payload: Partial<{
  name: string;
  initialCategoryCode: number;
  acceptedCategoryCode: number;
  statusCode: number;
  generalComment: string;
  closeoutComment: string;
  closedOn: string;
  closedById: string;
}>): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_deficienciesService.update(deficiencyId, {
      crc07_deficiencyname: payload.name,
      crc07_initialcategory: payload.initialCategoryCode as never,
      crc07_acceptedcategory: payload.acceptedCategoryCode as never,
      crc07_status: payload.statusCode as never,
      crc07_generalcomment: payload.generalComment,
      crc07_closeoutcomment: payload.closeoutComment,
      crc07_closedon: payload.closedOn,
      'crc07_Closed_By@odata.bind': payload.closedById ? `/systemusers(${normalizeGuid(payload.closedById)})` : undefined,
    });
  });
}

export async function getApprovalsByPlan(planId: string): Promise<ApprovalVm[]> {
  let rows: Awaited<ReturnType<typeof Crc07_pssr_approvalsService.getAll>>['data'] = [];
  let lastApprovalError: unknown;
  const approvalQueryAttempts: Array<Parameters<typeof Crc07_pssr_approvalsService.getAll>[0]> = [
    {
      select: [
        'crc07_pssr_approvalid',
        'crc07_pssrstage',
        'crc07_pssrstagename',
        'crc07_role',
        'crc07_rolename',
        'crc07_status',
        'crc07_statusname',
        'crc07_date',
        'crc07_comment',
        'modifiedon',
        '_crc07_member_value',
        '_crc07_relatedplan_value',
      ],
      top: 5000,
      orderBy: ['modifiedon desc'],
    },
    {
      select: [
        'crc07_pssr_approvalid',
        'crc07_pssrstage',
        'crc07_role',
        'crc07_status',
        'crc07_date',
        'crc07_comment',
        'modifiedon',
        '_crc07_member_value',
        '_crc07_relatedplan_value',
      ],
      top: 5000,
      orderBy: ['modifiedon desc'],
    },
  ];

  for (const options of approvalQueryAttempts) {
    try {
      const nextRows = await readDataverseRows(
        Crc07_pssr_approvalsService.getAll(options),
        'Timed out loading approvals from Dataverse.',
        'Loading approvals from Dataverse',
      );

      rows = nextRows;
      if (rows.length > 0 || options === approvalQueryAttempts[approvalQueryAttempts.length - 1]) {
        break;
      }
    } catch (error) {
      lastApprovalError = error;
    }
  }

  if (rows.length === 0 && lastApprovalError) {
    throw lastApprovalError;
  }

  const targetPlanId = normalizeGuid(planId);
  return rows
    .filter((item) => normalizeGuid(item._crc07_relatedplan_value) === targetPlanId)
    .map((item) => {
      const memberId = normalizeGuid(item._crc07_member_value);
      const stageCode = normalizeChoiceCode(item.crc07_pssrstage);
      const roleCode = normalizeChoiceCode(item.crc07_role);
      const decisionCode = normalizeApprovalDecisionCode(item.crc07_status);
      const comment = item.crc07_comment;

      return {
        id: normalizeGuid(item.crc07_pssr_approvalid),
        planId: normalizeGuid(item._crc07_relatedplan_value),
        memberId,
        stageCode,
        stageLabel: item.crc07_pssrstagename ?? lookupName(Crc07_pssr_approvalscrc07_pssrstage, stageCode),
        roleCode,
        roleLabel: inferApprovalRoleLabel({
          roleLabel: item.crc07_rolename ?? lookupName(Crc07_pssr_approvalscrc07_role, roleCode),
          stageCode,
          decisionCode,
          comment,
          memberId,
        }),
        decisionCode,
        decisionLabel: getApprovalDecisionLabel(decisionCode, item.crc07_statusname),
        approveOn: item.crc07_date,
        comment,
        modifiedOn: item.modifiedon,
      };
    });
}

export async function createApproval(payload: {
  planId: string;
  stageCode: number;
  roleCode?: number;
  statusCode?: number;
  comment?: string;
  memberId?: string;
  approveOn?: string;
}): Promise<string> {
  const createPayload = {
    crc07_pssrstage: payload.stageCode as never,
    crc07_role: payload.roleCode as never,
    crc07_status: payload.statusCode as never,
    crc07_comment: payload.comment,
    crc07_date: payload.approveOn,
    'crc07_Member@odata.bind': payload.memberId ? `/systemusers(${normalizeGuid(payload.memberId)})` : undefined,
    'crc07_RelatedPlan@odata.bind': `/crc07_pssr_plans(${normalizeGuid(payload.planId)})`,
  };

  const result = await withMutationRetry(async () => {
    return Crc07_pssr_approvalsService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_approvalsService.create>[0]);
  });

  return normalizeGuid(result.data?.crc07_pssr_approvalid ?? '');
}

export async function updateApproval(approvalId: string, payload: Partial<{
  statusCode: number;
  comment: string;
  approveOn: string;
}>): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_approvalsService.update(approvalId, {
      crc07_status: payload.statusCode as never,
      crc07_comment: payload.comment,
      crc07_date: payload.approveOn,
    });
  });
}

export async function updateChecklist(checklistId: string, payload: Partial<{
  statusCode: number;
}>): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_checklistsService.update(checklistId, {
      crc07_status: payload.statusCode as never,
    });
  });
}

export async function createTeamMember(payload: {
  planId: string;
  memberId: string;
  memberName: string;
  roleCode: number;
}): Promise<void> {
  const createPayload = {
    crc07_teammemberid: `TEAM-${Date.now()}`,
    crc07_name: payload.memberName,
    crc07_roles: payload.roleCode as never,
    'crc07_Member@odata.bind': `/systemusers(${payload.memberId})`,
    'crc07_RelatedPlan@odata.bind': `/crc07_pssr_plans(${payload.planId})`,
  };

  await withMutationRetry(async () => {
    await Crc07_pssr_team_membersService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_team_membersService.create>[0]);
  });
}

export async function getTeamByPlan(planId: string): Promise<TeamMemberVm[]> {
  const rows = await readDataverseRows(
    Crc07_pssr_team_membersService.getAll({
    select: ['crc07_pssr_team_memberid', 'crc07_name', 'crc07_roles', '_crc07_member_value', '_crc07_relatedplan_value'],
    top: 5000,
    orderBy: ['modifiedon desc'],
    }),
    'Timed out loading team members from Dataverse.',
    'Loading team members from Dataverse',
  );

  const targetPlanId = normalizeGuid(planId);
  return rows
    .filter((item) => normalizeGuid(item._crc07_relatedplan_value) === targetPlanId)
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_team_memberid),
      memberId: normalizeGuid(item._crc07_member_value),
      name: item.crc07_name,
      roleCode: item.crc07_roles as number | undefined,
      roleLabel: lookupName(Crc07_pssr_team_memberscrc07_roles, item.crc07_roles as number | undefined),
      planId: normalizeGuid(item._crc07_relatedplan_value),
    }));
}

export async function getTemplateChecklists(): Promise<TemplateChecklistVm[]> {
  let allTemplates: Awaited<ReturnType<typeof Crc07_pssr_template_checklistsService.getAll>>['data'] = [];
  let lastTemplateError: unknown;
  const templateQueryAttempts: Array<Parameters<typeof Crc07_pssr_template_checklistsService.getAll>[0]> = [
    {
      select: [
        'crc07_pssr_template_checklistid',
        'crc07_templatechecklistname',
        'crc07_description',
        'crc07_discipline',
        'crc07_disciplinename',
        'crc07_site',
        'crc07_sitename',
        'statecode',
      ],
      top: 5000,
      orderBy: ['modifiedon desc'],
    },
    {
      select: [
        'crc07_pssr_template_checklistid',
        'crc07_templatechecklistname',
        'crc07_description',
        'crc07_discipline',
        'crc07_site',
        'statecode',
      ],
      top: 5000,
    },
    undefined,
  ];

  for (const options of templateQueryAttempts) {
    try {
      const result = await withReadTimeout(
        Crc07_pssr_template_checklistsService.getAll(options),
        'Timed out loading template checklists from Dataverse.',
      );
      allTemplates = getResultData(result, 'Loading template checklists from Dataverse');
      if (allTemplates.length > 0 || options === undefined) {
        break;
      }
    } catch (error) {
      lastTemplateError = error;
    }
  }

  if (allTemplates.length === 0 && lastTemplateError) {
    throw lastTemplateError;
  }

  const templateQuestionsOutcome = await Promise.allSettled([
    readDataverseRows(
      Crc07_pssr_template_questionsService.getAll({
        select: ['crc07_pssr_template_questionid', '_crc07_templatechecklist_value'],
        top: 5000,
      }),
      'Timed out loading template questions from Dataverse.',
      'Loading template questions from Dataverse',
    ),
  ]);

  const templateQuestions = templateQuestionsOutcome[0]?.status === 'fulfilled'
    ? templateQuestionsOutcome[0].value
    : [];

  const countMap = new Map<string, number>();
  for (const question of templateQuestions) {
    const templateId = normalizeGuid(question._crc07_templatechecklist_value);
    countMap.set(templateId, (countMap.get(templateId) ?? 0) + 1);
  }

  return allTemplates.map((item) => {
    const templateId = normalizeGuid(item.crc07_pssr_template_checklistid);
    return {
      id: templateId,
      name: item.crc07_templatechecklistname,
      disciplineCode: item.crc07_discipline as number | undefined,
      disciplineLabel: item.crc07_disciplinename ?? lookupName(Crc07_pssr_template_checklistscrc07_discipline, item.crc07_discipline as number | undefined),
      siteCode: item.crc07_site as number | undefined,
      siteLabel: item.crc07_sitename ?? lookupName(Crc07_pssr_template_checklistscrc07_site, item.crc07_site as number | undefined),
      description: item.crc07_description,
      statusLabel: item.statecode === 0 ? 'Active' : 'Inactive',
      questionCount: countMap.get(templateId) ?? 0,
    };
  });
}

export async function getTemplateQuestions(templateChecklistId: string): Promise<TemplateQuestionVm[]> {
  const rows = await readDataverseRows(
    Crc07_pssr_template_questionsService.getAll({
    select: [
      'crc07_pssr_template_questionid',
      'crc07_questiontext',
      'crc07_sequenceorder',
      'crc07_ismandatory',
      'crc07_site',
      '_crc07_templatechecklist_value',
    ],
    top: 5000,
    orderBy: ['crc07_sequenceorder asc'],
    }),
    'Timed out loading template questions from Dataverse.',
    'Loading template questions from Dataverse',
  );

  const targetTemplateChecklist = normalizeGuid(templateChecklistId);
  return rows
    .filter((item) => normalizeGuid(item._crc07_templatechecklist_value) === targetTemplateChecklist)
    .map((item) => ({
      id: normalizeGuid(item.crc07_pssr_template_questionid),
      templateChecklistId: normalizeGuid(item._crc07_templatechecklist_value),
      questionText: item.crc07_questiontext,
      sequenceOrder: item.crc07_sequenceorder ?? 0,
      isMandatory: Boolean(item.crc07_ismandatory),
      siteCode: item.crc07_site as number | undefined,
    }));
}

export async function createTemplateChecklist(payload: {
  name: string;
  disciplineCode?: number;
  siteCode?: number;
}): Promise<string> {
  const createPayload = {
    crc07_templatechecklistname: payload.name,
    crc07_discipline: payload.disciplineCode as never,
    crc07_site: payload.siteCode as never,
  };

  const result = await withMutationRetry(async () => {
    return Crc07_pssr_template_checklistsService.create(
      createPayload as unknown as Parameters<typeof Crc07_pssr_template_checklistsService.create>[0],
    );
  });

  return normalizeGuid(result.data?.crc07_pssr_template_checklistid ?? '');
}

export async function updateTemplateChecklist(templateChecklistId: string, payload: {
  name?: string;
  disciplineCode?: number;
  siteCode?: number;
}): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_template_checklistsService.update(templateChecklistId, {
      crc07_templatechecklistname: payload.name,
      crc07_discipline: payload.disciplineCode as never,
      crc07_site: payload.siteCode as never,
    });
  });
}

export async function deleteTemplateChecklist(templateChecklistId: string): Promise<void> {
  const relatedQuestions = await getTemplateQuestions(templateChecklistId);

  for (const question of relatedQuestions) {
    await withMutationRetry(async () => {
      await Crc07_pssr_template_questionsService.delete(question.id);
    });
  }

  await withMutationRetry(async () => {
    await Crc07_pssr_template_checklistsService.delete(templateChecklistId);
  });
}

export async function createTemplateQuestion(payload: {
  templateChecklistId: string;
  questionText: string;
  sequenceOrder?: number;
  isMandatory?: boolean;
  siteCode?: number;
}): Promise<string> {
  const createPayload = {
    crc07_questiontext: payload.questionText,
    crc07_sequenceorder: payload.sequenceOrder,
    crc07_ismandatory: payload.isMandatory,
    crc07_site: payload.siteCode as never,
    'crc07_TemplateChecklist@odata.bind': `/crc07_pssr_template_checklists(${normalizeGuid(payload.templateChecklistId)})`,
  };

  const result = await withMutationRetry(async () => {
    return Crc07_pssr_template_questionsService.create(
      createPayload as unknown as Parameters<typeof Crc07_pssr_template_questionsService.create>[0],
    );
  });

  return normalizeGuid(result.data?.crc07_pssr_template_questionid ?? '');
}

export async function updateTemplateQuestion(questionId: string, payload: {
  questionText?: string;
  sequenceOrder?: number;
  isMandatory?: boolean;
  siteCode?: number;
}): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_template_questionsService.update(questionId, {
      crc07_questiontext: payload.questionText,
      crc07_sequenceorder: payload.sequenceOrder,
      crc07_ismandatory: payload.isMandatory,
      crc07_site: payload.siteCode as never,
    });
  });
}

export async function deleteTemplateQuestion(questionId: string): Promise<void> {
  await withMutationRetry(async () => {
    await Crc07_pssr_template_questionsService.delete(questionId);
  });
}

export async function resequenceTemplateQuestions(questionIdsInOrder: string[]): Promise<void> {
  for (let index = 0; index < questionIdsInOrder.length; index += 1) {
    await withMutationRetry(async () => {
      await Crc07_pssr_template_questionsService.update(questionIdsInOrder[index], {
        crc07_sequenceorder: index + 1,
      });
    });
  }
}

export async function copyTemplatesToPlan(planId: string, templateChecklistIds: string[]): Promise<void> {
  const allTemplateQuestions = await Crc07_pssr_template_questionsService.getAll({
    select: [
      'crc07_questiontext',
      'crc07_sequenceorder',
      'crc07_ismandatory',
      '_crc07_templatechecklist_value',
    ],
    top: 5000,
  });

  const templates = await Crc07_pssr_template_checklistsService.getAll({
    select: [
      'crc07_pssr_template_checklistid',
      'crc07_templatechecklistname',
      'crc07_discipline',
    ],
    top: 5000,
  });

  const selectedSet = new Set(templateChecklistIds.map((id) => normalizeGuid(id)));
  const selectedTemplates = (templates.data ?? []).filter((template) => selectedSet.has(normalizeGuid(template.crc07_pssr_template_checklistid)));

  for (const template of selectedTemplates) {
    const checklistId = await createChecklistFromPlan(planId, {
      name: template.crc07_templatechecklistname,
      disciplineCode: template.crc07_discipline as number | undefined,
      statusCode: 507650000,
    });

    const templateId = normalizeGuid(template.crc07_pssr_template_checklistid);
    const questions = (allTemplateQuestions.data ?? [])
      .filter((question) => normalizeGuid(question._crc07_templatechecklist_value) === templateId)
      .sort((a, b) => (a.crc07_sequenceorder ?? 0) - (b.crc07_sequenceorder ?? 0));

    for (const question of questions) {
      const createPayload = {
        crc07_questiontext: question.crc07_questiontext,
        crc07_ismandatory: question.crc07_ismandatory,
        crc07_sequenceorder: question.crc07_sequenceorder,
        'crc07_RelatedChecklist@odata.bind': `/crc07_pssr_checklists(${checklistId})`,
      };

      await withMutationRetry(async () => {
        await Crc07_pssr_checklist_questionsService.create(createPayload as unknown as Parameters<typeof Crc07_pssr_checklist_questionsService.create>[0]);
      });
    }
  }
}

export const optionSets = {
  planStage: Crc07_pssr_planscrc07_pssrstage,
  planSite: Crc07_pssr_planscrc07_site,
  planType: Crc07_pssr_planscrc07_type,
  approvalRole: Crc07_pssr_approvalscrc07_role,
  teamRole: Crc07_pssr_team_memberscrc07_roles,
  checklistStatus: Crc07_pssr_checklistscrc07_status,
  templateDiscipline: Crc07_pssr_template_checklistscrc07_discipline,
  templateSite: Crc07_pssr_template_checklistscrc07_site,
  templateQuestionSite: Crc07_pssr_template_questionscrc07_site,
  questionResponse: Crc07_pssr_checklist_questionscrc07_response,
  deficiencyStatus: Crc07_pssr_deficienciescrc07_status,
  deficiencyCategory: Crc07_pssr_deficienciescrc07_initialcategory,
};
