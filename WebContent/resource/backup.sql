
------------------- Get Event participant list ---------------------------------
-------------- TZA360_Get Event Participant list

select psi.uid
,( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
				INNER JOIN trackedentityinstance _tei on _tei.trackedentityinstanceid=_teav.trackedentityinstanceid
			where pi.trackedentityinstanceid=_tei.trackedentityinstanceid
					and _tea.uid='nR9d9xZ5TRJ' ) as firstname
, ( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
				INNER JOIN trackedentityinstance _tei on _tei.trackedentityinstanceid=_teav.trackedentityinstanceid
			where pi.trackedentityinstanceid=_tei.trackedentityinstanceid
					and _tea.uid='RsvOTmR2DjO' ) as lastname
, ( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
				INNER JOIN trackedentityinstance _tei on _tei.trackedentityinstanceid=_teav.trackedentityinstanceid
			where pi.trackedentityinstanceid=_tei.trackedentityinstanceid
					and _tea.uid='wSp6Q7QDMsk' ) as birthdate
, ( select value from trackedentitydatavalue _tedv 
				INNER JOIN dataelement _de on _de.dataelementid=_tedv.dataelementid
		where _tedv.programstageinstanceid=psi.programstageinstanceid
					and _de.uid='HzngfV7q0J5' ) -- CheckedIn DE
										
from program prg 
inner join programstage stage on stage.programid = prg.programid
inner join programstageinstance psi on psi.programstageid = stage.programstageid and stage.uid = 'G3HhsA7BiNs'  -- CwS - Client program
inner join programinstance pi on pi.programinstanceid = psi.programinstanceid
inner join trackedentitydatavalue tedv on tedv.programstageinstanceid = psi.programstageinstanceid
inner join dataelement de on de.dataelementid = tedv.dataelementid and de.uid='jjhgtSl7tlA'  -- == EventType DE
where tedv.value = 'GSE'
and psi.executiondate = '${eventDate}' 
and psi.programstageinstanceid in 
	( select _tedv.programstageinstanceid 
	from trackedentitydatavalue _tedv 
		inner join dataelement _de on _de.dataelementid = _tedv.dataelementid and _de.uid='Uw0LqwBvQGD'  -- == EventId DE
	where _tedv.programstageinstanceid = psi.programstageinstanceid and _tedv.value = '${eventId}' )


	
------------------- Search Client TEI infor by Voucher code  ------------------------
-------------- TZA360_Search Client TEI by Voucher

	
select  
  ( select _tei.uid from trackedentityinstance _tei
				where _tei.trackedentityinstanceid = rltship.trackedEntityInstanceBid ) as clientid
, ( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
			where _teav.trackedentityinstanceid = rltship.trackedEntityInstanceBid
					and _tea.uid='nR9d9xZ5TRJ' ) as firstname
, ( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
			where _teav.trackedentityinstanceid = rltship.trackedEntityInstanceBid
					and _tea.uid='RsvOTmR2DjO' ) as lastname
, ( select value from psi_view_trackedentityattributevalue _teav
				INNER JOIN psi_view_trackedentityattribute _tea on _tea.trackedentityattributeid=_teav.trackedentityattributeid
			where _teav.trackedentityinstanceid = rltship.trackedEntityInstanceBid
					and _tea.uid='wSp6Q7QDMsk' ) as birthdate
, tei.created
							
from programstage stage
inner join programstageinstance psi on psi.programstageid = stage.programstageid and stage.uid = 'm0Btps6lG5R'  -- CwS - Client program
inner join programinstance pi on pi.programinstanceid = psi.programinstanceid
inner join trackedentityinstance tei on tei.trackedentityinstanceid = pi.trackedentityinstanceid
inner join psi_view_trackedentityattributevalue tedv on tedv.trackedentityinstanceid = tei.trackedentityinstanceid and tedv.value='${voucherCode}'
inner join relationship rltship on rltship.trackedEntityInstanceAid = tei.trackedEntityInstanceid


